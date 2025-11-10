
import React from 'react';

interface HUDProps {
    lives: number;
    score: number;
    levelName: string;
}

export const HUD: React.FC<HUDProps> = ({ lives, score, levelName }) => {
    return (
        <div className="absolute top-0 left-0 right-0 p-4 bg-black bg-opacity-40 text-white flex justify-between items-center text-lg z-10">
            <div>
                <span>LIVES: </span>
                <span className="text-red-500 font-bold">{Array(lives).fill('♥').join(' ')}</span>
            </div>
            <div className="text-yellow-400 font-bold">{levelName}</div>
            <div>
                <span>SCORE: </span>
                <span className="text-green-400 font-bold">{score}</span>
            </div>
        </div>
    );
};
