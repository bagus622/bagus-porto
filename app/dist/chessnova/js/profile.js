/**
 * ChessNova - Profile Module
 * User profile and statistics
 */

(function() {
    'use strict';

    // DOM Elements
    const elements = {};
    
    // Chart instance
    let ratingChart = null;

    /**
     * Initialize profile module
     */
    function init() {
        cacheElements();
        loadProfile();
        loadStatistics();
        loadGameHistory();
        loadAchievements();
        createRatingChart();
        bindEvents();
        createParticles();
    }

    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements.profileAvatar = document.getElementById('profileAvatar');
        elements.profileName = document.getElementById('profileName');
        elements.profileTitle = document.getElementById('profileTitle');
        elements.memberBadge = document.getElementById('memberBadge');
        elements.editProfileBtn = document.getElementById('editProfileBtn');
        elements.avatarEditBtn = document.getElementById('avatarEditBtn');
        elements.editProfileModal = document.getElementById('editProfileModal');
        elements.editUsername = document.getElementById('editUsername');
        elements.avatarGrid = document.getElementById('avatarGrid');
        elements.saveProfileBtn = document.getElementById('saveProfileBtn');
        
        // Stats elements
        elements.totalWins = document.getElementById('totalWins');
        elements.totalLosses = document.getElementById('totalLosses');
        elements.totalDraws = document.getElementById('totalDraws');
        elements.winRate = document.getElementById('winRate');
        elements.totalGames = document.getElementById('totalGames');
        elements.puzzlesSolved = document.getElementById('puzzlesSolved');
        
        // Rating elements
        elements.currentRating = document.getElementById('currentRating');
        elements.highestRating = document.getElementById('highestRating');
        elements.lowestRating = document.getElementById('lowestRating');
        elements.ratedGames = document.getElementById('ratedGames');
        elements.ratingChart = document.getElementById('ratingChart');
        
        // History elements
        elements.gameHistoryBody = document.getElementById('gameHistoryBody');
        elements.emptyHistory = document.getElementById('emptyHistory');
        
        // Achievement elements
        elements.achievementsGrid = document.getElementById('achievementsGrid');
        
        // Settings elements
        elements.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        elements.resetStatsBtn = document.getElementById('resetStatsBtn');
        elements.exportDataBtn = document.getElementById('exportDataBtn');
    }

    /**
     * Load profile data
     */
    function loadProfile() {
        const profile = Storage.getProfile();
        
        elements.profileAvatar.textContent = profile.avatar;
        elements.profileName.textContent = profile.username;
        elements.profileTitle.textContent = profile.title;
        
        // Update member badge based on account age
        const accountAge = getAccountAge();
        if (accountAge < 7) {
            elements.memberBadge.textContent = '🆕 New Member';
        } else if (accountAge < 30) {
            elements.memberBadge.textContent = '👤 Member';
        } else {
            elements.memberBadge.textContent = '⭐ Veteran Member';
        }
    }

    /**
     * Get account age in days
     */
    function getAccountAge() {
        // For demo, return random value
        // In production, this would be based on account creation date
        return Math.floor(Math.random() * 60) + 1;
    }

    /**
     * Load statistics
     */
    function loadStatistics() {
        const stats = Storage.getStatistics();
        const profile = Storage.getProfile();
        
        // Animate numbers
        animateNumber(elements.totalWins, stats.wins);
        animateNumber(elements.totalLosses, stats.losses);
        animateNumber(elements.totalDraws, stats.draws);
        animateNumber(elements.winRate, stats.winRate, '%');
        animateNumber(elements.totalGames, stats.totalGames);
        animateNumber(elements.puzzlesSolved, stats.puzzlesSolved);
        
        // Rating stats
        elements.currentRating.textContent = profile.rating;
        
        const ratings = profile.ratingHistory;
        elements.highestRating.textContent = Math.max(...ratings);
        elements.lowestRating.textContent = Math.min(...ratings);
        elements.ratedGames.textContent = ratings.length - 1;
    }

    /**
     * Animate number counter
     */
    function animateNumber(element, target, suffix = '') {
        if (!element) return;
        
        const duration = 1000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        function update() {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(update);
            } else {
                element.textContent = target + suffix;
            }
        }
        
        update();
    }

    /**
     * Create rating chart
     */
    function createRatingChart() {
        const canvas = elements.ratingChart;
        if (!canvas) return;
        
        const profile = Storage.getProfile();
        const ratings = profile.ratingHistory;
        
        // Simple canvas chart
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        const padding = 20;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (ratings.length < 2) {
            ctx.fillStyle = '#71717A';
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Play more games to see rating history', width / 2, height / 2);
            return;
        }
        
        // Calculate scales
        const minRating = Math.min(...ratings) - 50;
        const maxRating = Math.max(...ratings) + 50;
        const ratingRange = maxRating - minRating;
        
        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw rating line
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        ratings.forEach((rating, index) => {
            const x = padding + (chartWidth / (ratings.length - 1)) * index;
            const y = padding + chartHeight - ((rating - minRating) / ratingRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw gradient fill
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw points
        ctx.fillStyle = '#22D3EE';
        ratings.forEach((rating, index) => {
            const x = padding + (chartWidth / (ratings.length - 1)) * index;
            const y = padding + chartHeight - ((rating - minRating) / ratingRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Load game history
     */
    function loadGameHistory() {
        const history = Storage.getGameHistory();
        
        if (history.length === 0) {
            elements.emptyHistory.classList.add('active');
            return;
        }
        
        elements.emptyHistory.classList.remove('active');
        elements.gameHistoryBody.innerHTML = '';
        
        history.slice(0, 20).forEach(game => {
            const row = document.createElement('tr');
            
            const date = new Date(game.date);
            const dateStr = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            
            const resultClass = game.result === 'win' ? 'result-win' : 
                               game.result === 'loss' ? 'result-loss' : 'result-draw';
            
            row.innerHTML = `
                <td>${dateStr}</td>
                <td>${game.mode === 'ai' ? `AI (${game.difficulty})` : 'Player'}</td>
                <td class="${resultClass}">${game.result.toUpperCase()}</td>
                <td>${game.mode === 'ai' ? 'vs AI' : 'PvP'}</td>
                <td>${game.pgn ? game.pgn.split(' ').length : '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="replayGame(${game.id})">📊</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteGame(${game.id})">🗑️</button>
                </td>
            `;
            
            elements.gameHistoryBody.appendChild(row);
        });
    }

    /**
     * Load achievements
     */
    function loadAchievements() {
        const achievements = Storage.getAchievements();
        
        document.querySelectorAll('.achievement-card').forEach(card => {
            const achievementId = card.dataset.achievement;
            if (achievements[achievementId]) {
                card.classList.remove('locked');
            }
        });
    }

    /**
     * Bind events
     */
    function bindEvents() {
        // Edit profile
        elements.editProfileBtn.addEventListener('click', showEditModal);
        elements.avatarEditBtn.addEventListener('click', showEditModal);
        
        // Save profile
        elements.saveProfileBtn.addEventListener('click', saveProfile);
        
        // Avatar selection
        document.querySelectorAll('.avatar-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterHistory(btn.dataset.filter);
            });
        });
        
        // Clear history
        elements.clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all game history?')) {
                Storage.clearGameHistory();
                loadGameHistory();
                showToast('Game history cleared', 'success');
            }
        });
        
        // Reset stats
        elements.resetStatsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all statistics?')) {
                Storage.saveStatistics({
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    totalGames: 0,
                    puzzlesSolved: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    winRate: 0
                });
                loadStatistics();
                showToast('Statistics reset', 'success');
            }
        });
        
        // Export data
        elements.exportDataBtn.addEventListener('click', exportData);
        
        // Mobile menu
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }
    }

    /**
     * Show edit profile modal
     */
    function showEditModal() {
        const profile = Storage.getProfile();
        elements.editUsername.value = profile.username;
        
        // Select current avatar
        document.querySelectorAll('.avatar-option').forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.avatar === profile.avatar);
        });
        
        elements.editProfileModal.classList.add('active');
    }

    /**
     * Close edit modal
     */
    window.closeEditModal = function() {
        elements.editProfileModal.classList.remove('active');
    };

    /**
     * Save profile
     */
    function saveProfile() {
        const username = elements.editUsername.value.trim();
        const selectedAvatar = document.querySelector('.avatar-option.selected');
        
        if (username) {
            Storage.updateUsername(username);
        }
        
        if (selectedAvatar) {
            Storage.updateAvatar(selectedAvatar.dataset.avatar);
        }
        
        loadProfile();
        closeEditModal();
        showToast('Profile updated!', 'success');
    }

    /**
     * Filter history
     */
    function filterHistory(filter) {
        const rows = elements.gameHistoryBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const resultCell = row.querySelector('td:nth-child(3)');
            const result = resultCell.textContent.toLowerCase();
            
            if (filter === 'all' || result === filter) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    /**
     * Replay game
     */
    window.replayGame = function(gameId) {
        const history = Storage.getGameHistory();
        const game = history.find(g => g.id === gameId);
        
        if (game && game.pgn) {
            // Store PGN for replay
            sessionStorage.setItem('replay_pgn', game.pgn);
            showToast('Replay feature coming soon!', 'info');
        }
    };

    /**
     * Delete game
     */
    window.deleteGame = function(gameId) {
        if (confirm('Delete this game from history?')) {
            Storage.deleteGameFromHistory(gameId);
            loadGameHistory();
            showToast('Game deleted', 'success');
        }
    };

    /**
     * Export data
     */
    function exportData() {
        const data = Storage.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `chessnova-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Data exported!', 'success');
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Create particles
     */
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            
            const colors = ['#6366F1', '#22D3EE', '#818CF8'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
        }
    }

    // Close modal on backdrop click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
