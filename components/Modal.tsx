
import React from 'react';

interface ModalProps {
    title: string;
    text: string;
    buttonText?: string;
    credits?: string;
    onButtonClick?: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, text, buttonText, credits, onButtonClick }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20 p-4">
            <div className="bg-gray-700 text-white border-4 border-gray-500 rounded-lg p-8 max-w-2xl text-center shadow-2xl animate-fade-in">
                <h1 className="text-3xl font-bold mb-4 text-yellow-400">{title}</h1>
                <p className="text-lg mb-6 whitespace-pre-wrap">{text}</p>
                {buttonText && onButtonClick && (
                    <button
                        onClick={onButtonClick}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        {buttonText}
                    </button>
                )}
                {credits && (
                     <p className="text-xs mt-6 text-gray-400">{credits}</p>
                )}
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
