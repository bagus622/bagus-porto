/**
 * ChessNova - Main Module
 * Landing page and shared functionality
 */

(function() {
    'use strict';

    /**
     * Initialize the page
     */
    function init() {
        createParticles();
        createPreviewBoard();
        animateStats();
        bindEvents();
        updateStatsFromStorage();
    }

    /**
     * Create floating particles
     */
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            
            // Random colors
            const colors = ['#6366F1', '#22D3EE', '#818CF8'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
        }
    }

    /**
     * Create animated preview board
     */
    function createPreviewBoard() {
        const board = document.getElementById('previewBoard');
        if (!board) return;

        // Starting position pieces
        const pieces = {
            0: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
            1: ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
            6: ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
            7: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
        };

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'preview-square';
                
                // Set color
                const isLight = (row + col) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');
                
                // Add piece
                if (pieces[row] && pieces[row][col]) {
                    square.textContent = pieces[row][col];
                    square.style.animationDelay = (row * 0.1 + col * 0.05) + 's';
                }
                
                board.appendChild(square);
            }
        }

        // Animate pieces occasionally
        setInterval(() => {
            const squares = board.querySelectorAll('.preview-square');
            const randomSquare = squares[Math.floor(Math.random() * squares.length)];
            if (randomSquare.textContent) {
                randomSquare.style.animation = 'none';
                setTimeout(() => {
                    randomSquare.style.animation = 'pieceFloat 0.5s ease';
                }, 10);
            }
        }, 3000);
    }

    /**
     * Animate statistics counter
     */
    function animateStats() {
        const totalGamesEl = document.getElementById('totalGames');
        if (!totalGamesEl) return;

        // Animate from 0 to actual value
        const targetValue = parseInt(totalGamesEl.textContent) || 0;
        let currentValue = 0;
        const duration = 2000;
        const increment = targetValue / (duration / 16);

        function updateCounter() {
            currentValue += increment;
            if (currentValue < targetValue) {
                totalGamesEl.textContent = Math.floor(currentValue);
                requestAnimationFrame(updateCounter);
            } else {
                totalGamesEl.textContent = targetValue;
            }
        }

        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
        });

        observer.observe(totalGamesEl);
    }

    /**
     * Update stats from storage
     */
    function updateStatsFromStorage() {
        const stats = Storage.getStatistics();
        const totalGamesEl = document.getElementById('totalGames');
        
        if (totalGamesEl && stats.totalGames > 0) {
            totalGamesEl.textContent = stats.totalGames;
        }
    }

    /**
     * Bind events
     */
    function bindEvents() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-board');
            
            parallaxElements.forEach(el => {
                const speed = 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Feature cards animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .mode-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });

        // Add fade-in styles
        const style = document.createElement('style');
        style.textContent = `
            .feature-card.fade-in,
            .mode-card.fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show coming soon modal
     */
    window.showComingSoon = function() {
        const modal = document.getElementById('comingSoonModal');
        if (modal) {
            modal.classList.add('active');
        }
    };

    /**
     * Close modal
     */
    window.closeModal = function() {
        const modal = document.getElementById('comingSoonModal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

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
