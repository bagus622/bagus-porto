/**
 * ChessNova - Sound Module
 * Manages all sound effects for the game
 */

const SoundManager = (function() {
    'use strict';

    // Audio context for generating sounds
    let audioContext = null;
    let isEnabled = true;

    // Sound frequencies and durations
    const SOUNDS = {
        move: { frequency: 400, duration: 0.05, type: 'sine' },
        capture: { frequency: 300, duration: 0.1, type: 'sawtooth' },
        check: { frequency: 600, duration: 0.15, type: 'square' },
        checkmate: { frequency: 800, duration: 0.5, type: 'sawtooth' },
        castle: { frequency: 350, duration: 0.1, type: 'sine' },
        promote: { frequency: 700, duration: 0.2, type: 'sine' },
        illegal: { frequency: 150, duration: 0.1, type: 'sawtooth' },
        win: { frequency: 523.25, duration: 0.3, type: 'sine' }, // C5
        lose: { frequency: 261.63, duration: 0.4, type: 'sawtooth' }, // C4
        draw: { frequency: 392, duration: 0.3, type: 'sine' }, // G4
        notify: { frequency: 500, duration: 0.1, type: 'sine' }
    };

    /**
     * Initialize audio context
     */
    function init() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
        
        // Load settings
        const settings = Storage.getSettings();
        isEnabled = settings.soundEnabled !== false;
    }

    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    function play(soundName) {
        if (!isEnabled || !audioContext) return;
        
        const sound = SOUNDS[soundName];
        if (!sound) return;

        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = sound.frequency;
            oscillator.type = sound.type;
            
            // Envelope
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + sound.duration);
        } catch (e) {
            console.warn('Sound play error:', e);
        }
    }

    /**
     * Play move sound
     */
    function playMove() {
        play('move');
    }

    /**
     * Play capture sound
     */
    function playCapture() {
        play('capture');
    }

    /**
     * Play check sound
     */
    function playCheck() {
        play('check');
    }

    /**
     * Play checkmate sound
     */
    function playCheckmate() {
        play('checkmate');
    }

    /**
     * Play castle sound
     */
    function playCastle() {
        play('castle');
    }

    /**
     * Play promotion sound
     */
    function playPromote() {
        play('promote');
    }

    /**
     * Play illegal move sound
     */
    function playIllegal() {
        play('illegal');
    }

    /**
     * Play win sound
     */
    function playWin() {
        if (!isEnabled || !audioContext) return;
        
        // Play victory melody
        const notes = [
            { freq: 523.25, time: 0 },      // C5
            { freq: 659.25, time: 0.1 },    // E5
            { freq: 783.99, time: 0.2 },    // G5
            { freq: 1046.50, time: 0.3 }    // C6
        ];
        
        notes.forEach(note => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = note.freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + note.time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + 0.3);
            
            oscillator.start(audioContext.currentTime + note.time);
            oscillator.stop(audioContext.currentTime + note.time + 0.3);
        });
    }

    /**
     * Play lose sound
     */
    function playLose() {
        if (!isEnabled || !audioContext) return;
        
        const notes = [
            { freq: 392, time: 0 },      // G4
            { freq: 349.23, time: 0.15 }, // F4
            { freq: 329.63, time: 0.3 }   // E4
        ];
        
        notes.forEach(note => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = note.freq;
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + note.time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.time + 0.4);
            
            oscillator.start(audioContext.currentTime + note.time);
            oscillator.stop(audioContext.currentTime + note.time + 0.4);
        });
    }

    /**
     * Play draw sound
     */
    function playDraw() {
        play('draw');
    }

    /**
     * Play notification sound
     */
    function playNotify() {
        play('notify');
    }

    /**
     * Toggle sound on/off
     * @returns {boolean} New sound state
     */
    function toggle() {
        isEnabled = !isEnabled;
        Storage.saveSettings({ soundEnabled: isEnabled });
        return isEnabled;
    }

    /**
     * Check if sound is enabled
     * @returns {boolean}
     */
    function isSoundEnabled() {
        return isEnabled;
    }

    /**
     * Set sound enabled state
     * @param {boolean} enabled
     */
    function setEnabled(enabled) {
        isEnabled = enabled;
        Storage.saveSettings({ soundEnabled: isEnabled });
    }

    /**
     * Resume audio context (needed for browsers that suspend it)
     */
    function resume() {
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    // Initialize on load
    if (typeof Storage !== 'undefined') {
        init();
    }

    // Public API
    return {
        init,
        play,
        playMove,
        playCapture,
        playCheck,
        playCheckmate,
        playCastle,
        playPromote,
        playIllegal,
        playWin,
        playLose,
        playDraw,
        playNotify,
        toggle,
        isSoundEnabled,
        setEnabled,
        resume
    };
})();

// Make available globally
window.SoundManager = SoundManager;
