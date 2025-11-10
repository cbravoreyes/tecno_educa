export interface PlayerState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    onGround: boolean;
    lives: number;
    score: number;
}

export type GameStatus = 'start' | 'playing' | 'levelComplete' | 'gameOver' | 'end';

export interface PlatformConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CollectibleConfig {
    x: number;
    y: number;
    name: string;
    fact: string;
    color: string;
}

export type EnemyType = 'rock' | 'ghost' | 'gear' | 'steam' | 'glitch' | 'firewall';
export type EnemyMovement = 'fall' | 'patrol' | 'static' | 'teleport';

export interface EnemyConfig {
    x: number;
    y: number;
    type: EnemyType;
    movement: EnemyMovement;
    patrolRange?: [number, number];
}

export interface EnemyState extends EnemyConfig {
  vx: number;
  vy: number;
  teleportTimer?: number;
}

export interface Level {
    name: string;
    backgroundColor: string;
    platforms: PlatformConfig[];
    collectibles: CollectibleConfig[];
    enemies: EnemyConfig[];
    startPos: { x: number; y: number };
    summary: string;
}
