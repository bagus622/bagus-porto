/**
 * ChessNova - Storage Module
 * Manages all localStorage operations for the application
 */

const Storage = (function() {
    'use strict';

    // Storage keys
    const KEYS = {
        SETTINGS: 'chessnova_settings',
        PROFILE: 'chessnova_profile',
        STATISTICS: 'chessnova_statistics',
        GAME_HISTORY: 'chessnova_game_history',
        SAVED_GAME: 'chessnova_saved_game',
        PUZZLE_PROGRESS: 'chessnova_puzzle_progress',
        ACHIEVEMENTS: 'chessnova_achievements'
    };

    // Default values
    const DEFAULTS = {
        settings: {
            soundEnabled: true,
            showLegalMoves: true,
            showLastMove: true,
            boardTheme: 'classic',
            pieceStyle: 'unicode',
            darkMode: true
        },
        profile: {
            username: 'Player',
            avatar: '👤',
            title: 'Chess Enthusiast',
            rating: 1500,
            ratingHistory: [1500]
        },
        statistics: {
            wins: 0,
            losses: 0,
            draws: 0,
            totalGames: 0,
            puzzlesSolved: 0,
            currentStreak: 0,
            bestStreak: 0,
            winRate: 0
        },
        puzzleProgress: {
            solved: [],
            currentRating: 1200,
            streak: 0
        },
        achievements: {
            first_win: false,
            winning_streak: false,
            puzzle_master: false,
            speed_demon: false,
            grandmaster: false,
            veteran: false
        }
    };

    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored data or default value
     */
    function get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.warn('Storage get error:', e);
            return defaultValue;
        }
    }

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     * @returns {boolean} Success status
     */
    function set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Storage set error:', e);
            return false;
        }
    }

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     */
    function remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Storage remove error:', e);
        }
    }

    /**
     * Clear all ChessNova data
     */
    function clearAll() {
        Object.values(KEYS).forEach(key => remove(key));
    }

    // ==================== SETTINGS ====================

    /**
     * Get settings
     * @returns {Object} User settings
     */
    function getSettings() {
        return get(KEYS.SETTINGS, DEFAULTS.settings);
    }

    /**
     * Save settings
     * @param {Object} settings - Settings to save
     */
    function saveSettings(settings) {
        set(KEYS.SETTINGS, { ...getSettings(), ...settings });
    }

    // ==================== PROFILE ====================

    /**
     * Get user profile
     * @returns {Object} User profile
     */
    function getProfile() {
        return get(KEYS.PROFILE, DEFAULTS.profile);
    }

    /**
     * Save user profile
     * @param {Object} profile - Profile data
     */
    function saveProfile(profile) {
        set(KEYS.PROFILE, { ...getProfile(), ...profile });
    }

    /**
     * Update username
     * @param {string} username - New username
     */
    function updateUsername(username) {
        const profile = getProfile();
        profile.username = username.substring(0, 20);
        saveProfile(profile);
    }

    /**
     * Update avatar
     * @param {string} avatar - New avatar emoji
     */
    function updateAvatar(avatar) {
        const profile = getProfile();
        profile.avatar = avatar;
        saveProfile(profile);
    }

    /**
     * Update rating
     * @param {number} newRating - New rating value
     */
    function updateRating(newRating) {
        const profile = getProfile();
        profile.rating = newRating;
        profile.ratingHistory.push(newRating);
        // Keep only last 50 ratings
        if (profile.ratingHistory.length > 50) {
            profile.ratingHistory = profile.ratingHistory.slice(-50);
        }
        saveProfile(profile);
    }

    // ==================== STATISTICS ====================

    /**
     * Get statistics
     * @returns {Object} Game statistics
     */
    function getStatistics() {
        return get(KEYS.STATISTICS, DEFAULTS.statistics);
    }

    /**
     * Save statistics
     * @param {Object} stats - Statistics data
     */
    function saveStatistics(stats) {
        set(KEYS.STATISTICS, { ...getStatistics(), ...stats });
    }

    /**
     * Record a game result
     * @param {string} result - 'win', 'loss', or 'draw'
     * @param {Object} gameData - Additional game data
     */
    function recordGame(result, gameData = {}) {
        const stats = getStatistics();
        
        if (result === 'win') {
            stats.wins++;
            stats.currentStreak++;
            if (stats.currentStreak > stats.bestStreak) {
                stats.bestStreak = stats.currentStreak;
            }
        } else if (result === 'loss') {
            stats.losses++;
            stats.currentStreak = 0;
        } else if (result === 'draw') {
            stats.draws++;
        }
        
        stats.totalGames++;
        stats.winRate = Math.round((stats.wins / stats.totalGames) * 100);
        
        saveStatistics(stats);
        
        // Add to game history
        addGameToHistory({
            id: Date.now(),
            date: new Date().toISOString(),
            result: result,
            ...gameData
        });
        
        // Check achievements
        checkAchievements();
        
        return stats;
    }

    /**
     * Record puzzle solve
     */
    function recordPuzzleSolve() {
        const stats = getStatistics();
        stats.puzzlesSolved++;
        saveStatistics(stats);
        
        // Update puzzle progress
        const progress = getPuzzleProgress();
        progress.streak++;
        progress.currentRating = Math.min(3000, progress.currentRating + 15);
        savePuzzleProgress(progress);
        
        checkAchievements();
        return stats;
    }

    /**
     * Record puzzle fail
     */
    function recordPuzzleFail() {
        const progress = getPuzzleProgress();
        progress.streak = 0;
        progress.currentRating = Math.max(400, progress.currentRating - 10);
        savePuzzleProgress(progress);
    }

    // ==================== GAME HISTORY ====================

    /**
     * Get game history
     * @returns {Array} List of games
     */
    function getGameHistory() {
        return get(KEYS.GAME_HISTORY, []);
    }

    /**
     * Add game to history
     * @param {Object} game - Game data
     */
    function addGameToHistory(game) {
        const history = getGameHistory();
        history.unshift(game);
        // Keep only last 100 games
        if (history.length > 100) {
            history.pop();
        }
        set(KEYS.GAME_HISTORY, history);
    }

    /**
     * Clear game history
     */
    function clearGameHistory() {
        remove(KEYS.GAME_HISTORY);
    }

    /**
     * Delete a specific game from history
     * @param {number} gameId - Game ID to delete
     */
    function deleteGameFromHistory(gameId) {
        const history = getGameHistory().filter(g => g.id !== gameId);
        set(KEYS.GAME_HISTORY, history);
    }

    // ==================== SAVED GAME ====================

    /**
     * Get saved game
     * @returns {Object|null} Saved game state
     */
    function getSavedGame() {
        return get(KEYS.SAVED_GAME, null);
    }

    /**
     * Save current game
     * @param {Object} gameState - Game state to save
     */
    function saveGame(gameState) {
        set(KEYS.SAVED_GAME, {
            ...gameState,
            savedAt: new Date().toISOString()
        });
    }

    /**
     * Clear saved game
     */
    function clearSavedGame() {
        remove(KEYS.SAVED_GAME);
    }

    // ==================== PUZZLE PROGRESS ====================

    /**
     * Get puzzle progress
     * @returns {Object} Puzzle progress
     */
    function getPuzzleProgress() {
        return get(KEYS.PUZZLE_PROGRESS, DEFAULTS.puzzleProgress);
    }

    /**
     * Save puzzle progress
     * @param {Object} progress - Progress data
     */
    function savePuzzleProgress(progress) {
        set(KEYS.PUZZLE_PROGRESS, progress);
    }

    /**
     * Mark puzzle as solved
     * @param {number} puzzleId - Puzzle ID
     */
    function markPuzzleSolved(puzzleId) {
        const progress = getPuzzleProgress();
        if (!progress.solved.includes(puzzleId)) {
            progress.solved.push(puzzleId);
            savePuzzleProgress(progress);
        }
    }

    /**
     * Check if puzzle is solved
     * @param {number} puzzleId - Puzzle ID
     * @returns {boolean}
     */
    function isPuzzleSolved(puzzleId) {
        return getPuzzleProgress().solved.includes(puzzleId);
    }

    // ==================== ACHIEVEMENTS ====================

    /**
     * Get achievements
     * @returns {Object} Achievement status
     */
    function getAchievements() {
        return get(KEYS.ACHIEVEMENTS, DEFAULTS.achievements);
    }

    /**
     * Unlock achievement
     * @param {string} achievementId - Achievement ID
     */
    function unlockAchievement(achievementId) {
        const achievements = getAchievements();
        if (!achievements[achievementId]) {
            achievements[achievementId] = true;
            set(KEYS.ACHIEVEMENTS, achievements);
            
            // Show notification
            showAchievementNotification(achievementId);
        }
    }

    /**
     * Check and unlock achievements based on current stats
     */
    function checkAchievements() {
        const stats = getStatistics();
        const profile = getProfile();
        
        if (stats.wins >= 1) unlockAchievement('first_win');
        if (stats.bestStreak >= 5) unlockAchievement('winning_streak');
        if (stats.puzzlesSolved >= 10) unlockAchievement('puzzle_master');
        if (profile.rating >= 2000) unlockAchievement('grandmaster');
        if (stats.totalGames >= 50) unlockAchievement('veteran');
    }

    /**
     * Show achievement notification
     * @param {string} achievementId - Achievement ID
     */
    function showAchievementNotification(achievementId) {
        const achievementNames = {
            first_win: '🏆 First Victory',
            winning_streak: '🔥 On Fire',
            puzzle_master: '🧩 Puzzle Master',
            speed_demon: '⚡ Speed Demon',
            grandmaster: '👑 Grandmaster',
            veteran: '🎖️ Veteran'
        };
        
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <span>🎉</span>
            <div>
                <strong>Achievement Unlocked!</strong>
                <p>${achievementNames[achievementId]}</p>
            </div>
        `;
        
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // ==================== EXPORT/IMPORT ====================

    /**
     * Export all data
     * @returns {Object} All user data
     */
    function exportData() {
        return {
            settings: getSettings(),
            profile: getProfile(),
            statistics: getStatistics(),
            gameHistory: getGameHistory(),
            puzzleProgress: getPuzzleProgress(),
            achievements: getAchievements(),
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Import data
     * @param {Object} data - Data to import
     * @returns {boolean} Success status
     */
    function importData(data) {
        try {
            if (data.settings) set(KEYS.SETTINGS, data.settings);
            if (data.profile) set(KEYS.PROFILE, data.profile);
            if (data.statistics) set(KEYS.STATISTICS, data.statistics);
            if (data.gameHistory) set(KEYS.GAME_HISTORY, data.gameHistory);
            if (data.puzzleProgress) set(KEYS.PUZZLE_PROGRESS, data.puzzleProgress);
            if (data.achievements) set(KEYS.ACHIEVEMENTS, data.achievements);
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    }

    // ==================== INITIALIZATION ====================

    /**
     * Initialize storage with defaults if empty
     */
    function init() {
        // Set defaults if not exists
        if (!localStorage.getItem(KEYS.SETTINGS)) {
            set(KEYS.SETTINGS, DEFAULTS.settings);
        }
        if (!localStorage.getItem(KEYS.PROFILE)) {
            set(KEYS.PROFILE, DEFAULTS.profile);
        }
        if (!localStorage.getItem(KEYS.STATISTICS)) {
            set(KEYS.STATISTICS, DEFAULTS.statistics);
        }
        if (!localStorage.getItem(KEYS.PUZZLE_PROGRESS)) {
            set(KEYS.PUZZLE_PROGRESS, DEFAULTS.puzzleProgress);
        }
        if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) {
            set(KEYS.ACHIEVEMENTS, DEFAULTS.achievements);
        }
    }

    // Initialize on load
    init();

    // Public API
    return {
        // Settings
        getSettings,
        saveSettings,
        
        // Profile
        getProfile,
        saveProfile,
        updateUsername,
        updateAvatar,
        updateRating,
        
        // Statistics
        getStatistics,
        saveStatistics,
        recordGame,
        recordPuzzleSolve,
        recordPuzzleFail,
        
        // Game History
        getGameHistory,
        addGameToHistory,
        clearGameHistory,
        deleteGameFromHistory,
        
        // Saved Game
        getSavedGame,
        saveGame,
        clearSavedGame,
        
        // Puzzle
        getPuzzleProgress,
        savePuzzleProgress,
        markPuzzleSolved,
        isPuzzleSolved,
        
        // Achievements
        getAchievements,
        unlockAchievement,
        checkAchievements,
        
        // Export/Import
        exportData,
        importData,
        
        // Utility
        clearAll,
        KEYS
    };
})();

// Make available globally
window.Storage = Storage;
