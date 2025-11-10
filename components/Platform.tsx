
import React from 'react';
import type { PlatformConfig } from '../types';

export const Platform: React.FC<PlatformConfig> = ({ x, y, width, height }) => {
    return (
        <div
            className="absolute bg-green-700 border-2 border-green-900"
            style={{
                left: x,
                top: y,
                width: width,
                height: height,
            }}
        />
    );
};
