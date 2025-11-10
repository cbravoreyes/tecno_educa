import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player } from './components/Player';
import { Platform } from './components/Platform';
import { Collectible } from './components/Collectible';
import { Enemy } from './components/Enemy';
import { HUD } from './components/HUD';
import { Modal } from './components/Modal';
import { LEVELS, GAME_CONFIG } from './constants';
import type { PlayerState, GameStatus, Level, EnemyState } from './types';
import { playJumpSound, playCollectSound, playLevelCompleteSound, playHurtSound } from './services/audioService';

const App: React.FC = () => {
    const [status, setStatus] = useState<GameStatus>('start');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [level, setLevel] = useState<Level>(LEVELS[currentLevelIndex]);
    const [player, setPlayer] = useState<PlayerState>({ ...GAME_CONFIG.initialPlayerState });
    const [collectedItems, setCollectedItems] = useState<number[]>([]);
    const [enemies, setEnemies] = useState<EnemyState[]>([]);
    const [modal, setModal] = useState<{ title: string; text: string; buttonText?: string; onButtonClick?: () => void; } | null>(null);
    const keys = useRef<{ [key: string]: boolean }>({});
    const gameLoopRef = useRef<number>();
    const enemiesRef = useRef<EnemyState[]>([]);
    const lastFrameTimeRef = useRef<number>(Date.now());
    const playerHitRef = useRef(false);

    const resetLevel = useCallback((levelIndex: number) => {
        const newLevel = LEVELS[levelIndex];
        setLevel(newLevel);
        setPlayer({
            ...GAME_CONFIG.initialPlayerState,
            x: newLevel.startPos.x,
            y: newLevel.startPos.y,
        });
        setCollectedItems([]);
        const newEnemies = newLevel.enemies.map(e => ({
            ...e,
            vx: e.movement === 'patrol' ? 1.5 : 0,
            vy: e.movement === 'fall' ? 3 : 0,
            teleportTimer: e.movement === 'teleport' ? Math.random() * 3000 + 1000 : undefined,
        }));
        setEnemies(newEnemies);
        enemiesRef.current = newEnemies;
        setModal(null);
        playerHitRef.current = false;
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keys.current[e.code] = true;
            if (e.code === 'Space') e.preventDefault();
        };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const showFactModal = (collectible: (typeof level.collectibles)[0]) => {
        setModal({
            title: collectible.name,
            text: collectible.fact,
            buttonText: 'Continue Exploring',
            onButtonClick: () => setModal(null),
        });
    };
    
    const showLevelCompleteModal = () => {
        playLevelCompleteSound();
        const isLastLevel = currentLevelIndex === LEVELS.length - 1;
        setModal({
            title: `Level Complete: ${level.name}`,
            text: level.summary,
            buttonText: isLastLevel ? 'Finish Game' : 'Next Level',
            onButtonClick: () => {
                if (isLastLevel) {
                    setStatus('end');
                } else {
                    const nextLevelIndex = currentLevelIndex + 1;
                    setCurrentLevelIndex(nextLevelIndex);
                    resetLevel(nextLevelIndex);
                    setStatus('playing');
                }
            },
        });
    };

    const gameLoop = useCallback(() => {
        if (status !== 'playing' || modal || playerHitRef.current) {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
            return;
        }
        
        const now = Date.now();
        const deltaTime = now - lastFrameTimeRef.current;
        lastFrameTimeRef.current = now;

        // Update enemies
        enemiesRef.current = enemiesRef.current.map(enemy => {
            let { x, y, vx, vy, type, movement, patrolRange, teleportTimer } = enemy;
            const enemySize = GAME_CONFIG.enemySizes[type];
            switch (movement) {
                case 'fall':
                    y += vy;
                    if (y > GAME_CONFIG.height) y = -enemySize.height;
                    break;
                case 'patrol':
                    x += vx;
                    if (patrolRange && (x < patrolRange[0] || x + enemySize.width > patrolRange[1])) {
                        vx = -vx;
                    }
                    break;
                case 'teleport':
                    if (teleportTimer !== undefined) {
                        teleportTimer -= deltaTime;
                        if (teleportTimer <= 0) {
                            const platform = level.platforms[Math.floor(Math.random() * level.platforms.length)];
                            x = platform.x + Math.random() * (platform.width - enemySize.width);
                            y = platform.y - enemySize.height;
                            teleportTimer = Math.random() * 3000 + 1000;
                        }
                    }
                    break;
            }
            return { ...enemy, x, y, vx, teleportTimer };
        });
        setEnemies(enemiesRef.current);

        setPlayer(p => {
            let { x, y, vx, vy, onGround, lives, score } = p;

            // Horizontal movement
            if (keys.current['ArrowLeft']) vx = -GAME_CONFIG.playerSpeed;
            else if (keys.current['ArrowRight']) vx = GAME_CONFIG.playerSpeed;
            else vx = 0;

            // Jumping
            if (keys.current['Space'] && onGround) {
                vy = -GAME_CONFIG.jumpStrength;
                onGround = false;
                playJumpSound();
            }

            // Apply gravity
            vy += GAME_CONFIG.gravity;
            x += vx;
            y += vy;

            // Game boundaries
            if (x < 0) x = 0;
            if (x + GAME_CONFIG.playerSize.width > GAME_CONFIG.width) x = GAME_CONFIG.width - GAME_CONFIG.playerSize.width;
            if (y > GAME_CONFIG.height) { // Fell off bottom
                 playerHitRef.current = true;
            }
            
            // Platform collision
            let onAnyPlatform = false;
            level.platforms.forEach(platform => {
                const playerBottom = y + GAME_CONFIG.playerSize.height;
                const playerPrevBottom = (y - vy) + GAME_CONFIG.playerSize.height;
                if (
                    x + GAME_CONFIG.playerSize.width > platform.x &&
                    x < platform.x + platform.width &&
                    playerBottom >= platform.y &&
                    playerPrevBottom <= platform.y + 1 // +1 for tolerance
                ) {
                      y = platform.y - GAME_CONFIG.playerSize.height;
                      vy = 0;
                      onAnyPlatform = true;
                }
            });
            onGround = onAnyPlatform;
            
            // Collectible collision
            level.collectibles.forEach((collectible, index) => {
                if (!collectedItems.includes(index) &&
                    x < collectible.x + GAME_CONFIG.collectibleSize.width &&
                    x + GAME_CONFIG.playerSize.width > collectible.x &&
                    y < collectible.y + GAME_CONFIG.collectibleSize.height &&
                    y + GAME_CONFIG.playerSize.height > collectible.y
                ) {
                    setCollectedItems(prev => [...prev, index]);
                    score += 100;
                    playCollectSound();
                    showFactModal(collectible);
                }
            });
            
            // Enemy collision
            enemiesRef.current.forEach(enemy => {
                const enemySize = GAME_CONFIG.enemySizes[enemy.type];
                 if (
                    x < enemy.x + enemySize.width &&
                    x + GAME_CONFIG.playerSize.width > enemy.x &&
                    y < enemy.y + enemySize.height &&
                    y + GAME_CONFIG.playerSize.height > enemy.y
                ) {
                    playerHitRef.current = true;
                }
            });

            if (playerHitRef.current) {
                playHurtSound();
                lives -= 1;
                setTimeout(() => {
                    if (lives > 0) {
                        setPlayer(p => ({
                            ...p,
                            lives,
                            x: level.startPos.x,
                            y: level.startPos.y,
                            vx: 0,
                            vy: 0,
                        }));
                        playerHitRef.current = false;
                    } else {
                        setStatus('gameOver');
                    }
                }, 500);
            }
            
            return { x, y, vx, vy, onGround, lives, score };
        });

        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, [status, modal, level, resetLevel, currentLevelIndex, collectedItems]);
    
    useEffect(() => {
        if(status === 'playing' && collectedItems.length === level.collectibles.length) {
            setStatus('levelComplete');
            showLevelCompleteModal();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectedItems, level.collectibles.length, status]);


    useEffect(() => {
        if (status === 'playing') {
            lastFrameTimeRef.current = Date.now();
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [status, gameLoop]);

    const startGame = () => {
        setCurrentLevelIndex(0);
        resetLevel(0);
        setStatus('playing');
    };
    
    const restartGame = () => {
        setPlayer(p => ({...p, lives: GAME_CONFIG.initialPlayerState.lives, score: 0}));
        startGame();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800 font-mono">
            <div className="relative overflow-hidden border-4 border-gray-600 rounded-lg shadow-2xl" style={{ width: GAME_CONFIG.width, height: GAME_CONFIG.height, backgroundColor: level.backgroundColor }}>
                {status === 'start' && (
                    <Modal
                        title="Edutec's Adventure"
                        text="Help Edutec, the time-traveling teacher, recover the instruments of knowledge! Use Arrow Keys to move and Spacebar to jump. Avoid the obstacles!"
                        buttonText="Start"
                        onButtonClick={startGame}
                    />
                )}
                {status === 'gameOver' && (
                    <Modal
                        title="Game Over"
                        text={`Your final score: ${player.score}. The quest for knowledge is endless!`}
                        buttonText="Try Again"
                        onButtonClick={restartGame}
                    />
                )}
                {status === 'end' && (
                    <Modal
                        title="Congratulations!"
                        text={`You have restored the history of educational technology! Final Score: ${player.score}. Remember: "La tecnología cambia, pero enseñar sigue siendo un arte humano."`}
                        credits="Creado con IA para Carlos Bravo Reyes – Observatorio de Tecnología e Innovación Educativa (CC BY-NC-SA 4.0)"
                        buttonText="Play Again"
                        onButtonClick={restartGame}
                    />
                )}
                
                { (status === 'playing' || status === 'levelComplete') && modal && (
                   <Modal
                       title={modal.title}
                       text={modal.text}
                       buttonText={modal.buttonText}
                       onButtonClick={modal.onButtonClick}
                    />
                )}
                
                {(status === 'playing' || status === 'levelComplete' || status === 'gameOver') && (
                    <>
                        <HUD lives={player.lives} score={player.score} levelName={level.name} />
                        {level.platforms.map((p, i) => (
                            <Platform key={i} {...p} />
                        ))}
                        {level.collectibles.map((c, i) => (
                           !collectedItems.includes(i) && <Collectible key={i} {...c} />
                        ))}
                        {enemies.map((e, i) => (
                            <Enemy key={i} {...e} />
                        ))}
                        <Player x={player.x} y={player.y} isHit={playerHitRef.current} />
                    </>
                )}
            </div>
        </div>
    );
};

export default App;
