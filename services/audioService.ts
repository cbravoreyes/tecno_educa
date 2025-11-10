let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
    if (typeof window !== 'undefined') {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser");
                return null;
            }
        }
    }
    return audioContext;
};

const playSound = (type: OscillatorType, frequency: number, duration: number) => {
    const context = getAudioContext();
    if (!context) return;
    
    // Resume context on user gesture
    if (context.state === 'suspended') {
        context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
};

export const playJumpSound = () => {
    playSound('sine', 440, 0.2);
};

export const playCollectSound = () => {
    playSound('triangle', 880, 0.2);
};

export const playHurtSound = () => {
    playSound('square', 110, 0.3);
};

export const playLevelCompleteSound = () => {
     const context = getAudioContext();
    if (!context) return;
    playSound('sine', 261.63, 0.15); // C4
    setTimeout(() => playSound('sine', 329.63, 0.15), 150); // E4
    setTimeout(() => playSound('sine', 392.00, 0.15), 300); // G4
    setTimeout(() => playSound('sine', 523.25, 0.3), 450);  // C5
}
