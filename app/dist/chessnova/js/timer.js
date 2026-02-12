/**
 * ChessNova - Timer Module
 * Manages game clock and time controls
 */

const Timer = (function() {
    'use strict';

    let whiteTime = 0;      // Time in seconds for white
    let blackTime = 0;      // Time in seconds for black
    let currentTurn = 'w';  // Current turn: 'w' or 'b'
    let isRunning = false;
    let intervalId = null;
    let onTimeUpCallback = null;
    let onTickCallback = null;
    let increment = 0;      // Increment in seconds

    /**
     * Format time for display
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string (MM:SS or HH:MM:SS)
     */
    function formatTime(seconds) {
        if (seconds <= 0) return '0:00';
        
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Initialize timer with time control
     * @param {number} minutes - Starting time in minutes (0 for unlimited)
     * @param {number} inc - Increment in seconds
     */
    function init(minutes, inc = 0) {
        stop();
        
        const totalSeconds = minutes > 0 ? minutes * 60 : 0;
        whiteTime = totalSeconds;
        blackTime = totalSeconds;
        increment = inc;
        currentTurn = 'w';
        isRunning = false;
    }

    /**
     * Start the timer
     */
    function start() {
        if (isRunning) return;
        
        // Resume audio context if needed
        if (typeof SoundManager !== 'undefined') {
            SoundManager.resume();
        }
        
        isRunning = true;
        intervalId = setInterval(tick, 1000);
    }

    /**
     * Stop the timer
     */
    function stop() {
        isRunning = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    /**
     * Toggle timer on/off
     */
    function toggle() {
        if (isRunning) {
            stop();
        } else {
            start();
        }
    }

    /**
     * Tick function called every second
     */
    function tick() {
        if (!isRunning) return;
        
        if (currentTurn === 'w') {
            whiteTime--;
            if (whiteTime <= 0) {
                whiteTime = 0;
                stop();
                if (onTimeUpCallback) {
                    onTimeUpCallback('w');
                }
            }
        } else {
            blackTime--;
            if (blackTime <= 0) {
                blackTime = 0;
                stop();
                if (onTimeUpCallback) {
                    onTimeUpCallback('b');
                }
            }
        }
        
        if (onTickCallback) {
            onTickCallback(getTimeData());
        }
    }

    /**
     * Switch turn and add increment
     */
    function switchTurn() {
        // Add increment to the player who just moved
        if (increment > 0) {
            if (currentTurn === 'w') {
                whiteTime += increment;
            } else {
                blackTime += increment;
            }
        }
        
        currentTurn = currentTurn === 'w' ? 'b' : 'w';
        
        if (onTickCallback) {
            onTickCallback(getTimeData());
        }
    }

    /**
     * Get current time data
     * @returns {Object} Time data for both players
     */
    function getTimeData() {
        return {
            white: {
                seconds: whiteTime,
                formatted: formatTime(whiteTime),
                isLow: whiteTime <= 30 && whiteTime > 0,
                isCritical: whiteTime <= 10 && whiteTime > 0
            },
            black: {
                seconds: blackTime,
                formatted: formatTime(blackTime),
                isLow: blackTime <= 30 && blackTime > 0,
                isCritical: blackTime <= 10 && blackTime > 0
            },
            currentTurn: currentTurn,
            isRunning: isRunning
        };
    }

    /**
     * Get formatted time for a player
     * @param {string} color - 'w' or 'b'
     * @returns {string} Formatted time
     */
    function getFormattedTime(color) {
        return formatTime(color === 'w' ? whiteTime : blackTime);
    }

    /**
     * Set callback for when time runs out
     * @param {Function} callback - Function to call when time is up
     */
    function onTimeUp(callback) {
        onTimeUpCallback = callback;
    }

    /**
     * Set callback for each tick
     * @param {Function} callback - Function to call on each tick
     */
    function onTick(callback) {
        onTickCallback = callback;
    }

    /**
     * Add time to a player
     * @param {string} color - 'w' or 'b'
     * @param {number} seconds - Seconds to add
     */
    function addTime(color, seconds) {
        if (color === 'w') {
            whiteTime += seconds;
        } else {
            blackTime += seconds;
        }
        
        if (onTickCallback) {
            onTickCallback(getTimeData());
        }
    }

    /**
     * Set time for a player
     * @param {string} color - 'w' or 'b'
     * @param {number} seconds - Seconds to set
     */
    function setTime(color, seconds) {
        if (color === 'w') {
            whiteTime = seconds;
        } else {
            blackTime = seconds;
        }
        
        if (onTickCallback) {
            onTickCallback(getTimeData());
        }
    }

    /**
     * Get current turn
     * @returns {string} 'w' or 'b'
     */
    function getCurrentTurn() {
        return currentTurn;
    }

    /**
     * Set current turn
     * @param {string} turn - 'w' or 'b'
     */
    function setCurrentTurn(turn) {
        currentTurn = turn;
    }

    /**
     * Check if timer is running
     * @returns {boolean}
     */
    function isTimerRunning() {
        return isRunning;
    }

    /**
     * Reset timer
     */
    function reset() {
        stop();
        whiteTime = 0;
        blackTime = 0;
        currentTurn = 'w';
        increment = 0;
    }

    /**
     * Pause timer (alias for stop)
     */
    function pause() {
        stop();
    }

    /**
     * Resume timer (alias for start)
     */
    function resume() {
        start();
    }

    // Public API
    return {
        init,
        start,
        stop,
        toggle,
        switchTurn,
        getTimeData,
        getFormattedTime,
        onTimeUp,
        onTick,
        addTime,
        setTime,
        getCurrentTurn,
        setCurrentTurn,
        isTimerRunning,
        reset,
        pause,
        resume,
        formatTime
    };
})();

// Make available globally
window.Timer = Timer;
