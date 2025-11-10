import React from 'react';
import { GAME_CONFIG } from '../constants';
import type { EnemyState } from '../types';

const Enemy: React.FC<EnemyState> = ({ x, y, type }) => {
    const size = GAME_CONFIG.enemySizes[type];
    let style = {};
    let className = "absolute";

    switch (type) {
        case 'rock':
            className += " bg-gray-600 border-2 border-black";
            break;
        case 'ghost':
            className += " bg-white opacity-60 rounded-t-full";
            break;
        case 'gear':
            className += " bg-yellow-700 border-2 border-yellow-900 rounded-full animate-spin-slow";
            break;
        case 'steam':
            className += " bg-gray-300 opacity-70 animate-pulse rounded-t-lg";
            break;
        case 'glitch':
            className += " bg-pink-500 animate-ping";
            break;
        case 'firewall':
            className += " bg-red-600 border-y-2 border-red-400 animate-pulse";
            break;
    }
    
    return (
        <>
            <div
                className={className}
                style={{
                    left: x,
                    top: y,
                    width: size.width,
                    height: size.height,
                    ...style
                }}
            />
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 4s linear infinite;
                }
            `}</style>
        </>
    );
};

export { Enemy };
