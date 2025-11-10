import React from 'react';
import { GAME_CONFIG } from '../constants';

interface PlayerProps {
    x: number;
    y: number;
    isHit: boolean;
}

export const Player: React.FC<PlayerProps> = ({ x, y, isHit }) => {
    return (
        <>
            <div
                className={`absolute bg-orange-500 border-2 border-black transition-opacity duration-100 ${isHit ? 'animate-flash' : ''}`}
                style={{
                    left: x,
                    top: y,
                    width: GAME_CONFIG.playerSize.width,
                    height: GAME_CONFIG.playerSize.height,
                }}
            />
            <style>{`
                @keyframes flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.2; }
                }
                .animate-flash {
                    animation: flash 0.5s linear;
                }
            `}</style>
        </>
    );
};
