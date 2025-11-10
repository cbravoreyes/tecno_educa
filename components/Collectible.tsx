
import React from 'react';
import { GAME_CONFIG } from '../constants';
import type { CollectibleConfig } from '../types';

export const Collectible: React.FC<CollectibleConfig> = ({ x, y, color }) => {
    return (
        <div
            className={`absolute ${color} border-2 border-white animate-pulse`}
            style={{
                left: x,
                top: y,
                width: GAME_CONFIG.collectibleSize.width,
                height: GAME_CONFIG.collectibleSize.height,
                borderRadius: '50%',
            }}
        />
    );
};
