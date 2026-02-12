/**
 * ChessNova - Puzzle Module
 * Chess puzzles and tactical training
 */

(function() {
    'use strict';

    // Puzzle database
    const PUZZLES = [
        {
            id: 1,
            name: "Back Rank Mate",
            type: "mate1",
            difficulty: "easy",
            rating: 800,
            fen: "4r1k1/5ppp/8/8/8/8/5PPP/5RK1 w - - 0 1",
            solution: ["Re8#"],
            hint: "Look for a back rank checkmate!"
        },
        {
            id: 2,
            name: "Scholar's Mate",
            type: "mate1",
            difficulty: "easy",
            rating: 600,
            fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
            solution: ["Qxf7#"],
            hint: "The f7 square is weak!"
        },
        {
            id: 3,
            name: "Smothered Mate",
            type: "mate1",
            difficulty: "medium",
            rating: 1200,
            fen: "6rk/5Npp/8/8/8/8/8/4K3 w - - 0 1",
            solution: ["Nh6#"],
            hint: "Knight can deliver a smothered mate!"
        },
        {
            id: 4,
            name: "Anastasia's Mate",
            type: "mate1",
            difficulty: "medium",
            rating: 1400,
            fen: "4r1k1/4R1pp/8/8/8/8/8/4K3 w - - 0 1",
            solution: ["Rh7#"],
            hint: "Use the rook on the h-file!"
        },
        {
            id: 5,
            name: "Boden's Mate",
            type: "mate1",
            difficulty: "hard",
            rating: 1600,
            fen: "r3k2r/ppp2ppp/8/8/2B5/8/PPP2PPP/2KR4 w kq - 0 1",
            solution: ["Re8#"],
            hint: "Sacrifice on e8!"
        },
        {
            id: 6,
            name: "Mate in 2 - Opera Game",
            type: "mate2",
            difficulty: "medium",
            rating: 1500,
            fen: "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            solution: ["Nxe5", "Qh5"],
            hint: "The famous Opera Game combination!"
        },
        {
            id: 7,
            name: "Legal's Mate",
            type: "mate2",
            difficulty: "medium",
            rating: 1400,
            fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
            solution: ["Nxe5", "Nxf7"],
            hint: "Sacrifice the queen for a beautiful mate!"
        },
        {
            id: 8,
            name: "Fool's Mate Defense",
            type: "mate1",
            difficulty: "easy",
            rating: 400,
            fen: "rnbqkbnr/pppp1ppp/4p3/8/6Pq/8/PPPPPP1P/RNBQKBNR b KQkq - 0 1",
            solution: ["Qxf2#"],
            hint: "The fastest checkmate!"
        },
        {
            id: 9,
            name: "Arabian Mate",
            type: "mate1",
            difficulty: "medium",
            rating: 1300,
            fen: "7k/5R2/8/8/8/8/8/4K2N w - - 0 1",
            solution: ["Nf7#"],
            hint: "Knight and rook work together!"
        },
        {
            id: 10,
            name: "Greco's Mate",
            type: "mate1",
            difficulty: "hard",
            rating: 1700,
            fen: "4r1k1/5ppp/8/8/8/8/5PPP/5RK1 w - - 0 1",
            solution: ["Re8#"],
            hint: "Back rank mate with rook!"
        },
        {
            id: 11,
            name: "Fork Tactics",
            type: "tactical",
            difficulty: "easy",
            rating: 900,
            fen: "8/8/8/4n3/8/2K2k2/8/8 b - - 0 1",
            solution: ["Nd3+"],
            hint: "Fork the king and..."
        },
        {
            id: 12,
            name: "Pin and Win",
            type: "tactical",
            difficulty: "medium",
            rating: 1100,
            fen: "r3k2r/ppp2ppp/8/8/1B6/8/PPP2PPP/2KR4 w kq - 0 1",
            solution: ["Bxf7+"],
            hint: "Pin the king to win material!"
        }
    ];

    // Game state
    let game = null;
    let currentPuzzle = null;
    let currentMoveIndex = 0;
    let board = null;
    let selectedSquare = null;
    let legalMoves = [];
    let isFlipped = false;
    let puzzleProgress = null;

    // DOM Elements
    const elements = {};

    /**
     * Initialize puzzle module
     */
    function init() {
        // Load settings and progress
        const settings = Storage.getSettings();
        puzzleProgress = Storage.getPuzzleProgress();
        
        // Initialize chess.js
        game = new Chess();
        
        // Cache DOM elements
        cacheElements();
        
        // Create board
        createBoard();
        
        // Load puzzle list
        loadPuzzleList();
        
        // Load first unsolved puzzle
        loadNextPuzzle();
        
        // Bind events
        bindEvents();
        
        // Update stats
        updateStats();
        
        // Apply theme
        applyTheme(settings.boardTheme);
        
        console.log('ChessNova Puzzles initialized');
    }

    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements.board = document.getElementById('puzzleBoard');
        elements.boardContainer = document.getElementById('boardContainer');
        elements.boardOverlay = document.getElementById('boardOverlay');
        elements.puzzleFeedback = document.getElementById('puzzleFeedback');
        elements.puzzleTitle = document.getElementById('puzzleTitle');
        elements.puzzleDifficulty = document.getElementById('puzzleDifficulty');
        elements.puzzleRating = document.getElementById('puzzleRating');
        elements.puzzleObjective = document.getElementById('puzzleObjective');
        elements.hintText = document.getElementById('hintText');
        elements.puzzleList = document.getElementById('puzzleList');
        elements.progressFill = document.getElementById('progressFill');
        elements.progressText = document.getElementById('progressText');
        elements.solvedCount = document.getElementById('solvedCount');
        elements.streakCount = document.getElementById('streakCount');
        elements.ratingDisplay = document.getElementById('ratingDisplay');
        elements.successModal = document.getElementById('successModal');
        elements.failureModal = document.getElementById('failureModal');
        elements.completeModal = document.getElementById('completeModal');
    }

    /**
     * Create chess board
     */
    function createBoard() {
        elements.board.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = 'board-square';
                square.dataset.row = row;
                square.dataset.col = col;
                
                const isLight = (row + col) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');
                
                const notation = getSquareNotation(row, col);
                square.dataset.square = notation;
                
                square.addEventListener('click', () => onSquareClick(row, col));
                square.addEventListener('dragover', onDragOver);
                square.addEventListener('drop', (e) => onDrop(e, row, col));
                
                elements.board.appendChild(square);
            }
        }
    }

    /**
     * Get algebraic notation
     */
    function getSquareNotation(row, col) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        return files[col] + ranks[row];
    }

    /**
     * Get coordinates from notation
     */
    function getSquareCoords(notation) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        return {
            row: ranks.indexOf(notation[1]),
            col: files.indexOf(notation[0])
        };
    }

    /**
     * Load puzzle list
     */
    function loadPuzzleList() {
        elements.puzzleList.innerHTML = '';
        
        PUZZLES.forEach(puzzle => {
            const item = document.createElement('div');
            item.className = 'puzzle-item';
            item.dataset.id = puzzle.id;
            
            if (Storage.isPuzzleSolved(puzzle.id)) {
                item.classList.add('completed');
            }
            
            if (currentPuzzle && currentPuzzle.id === puzzle.id) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <div class="puzzle-item-number">${puzzle.id}</div>
                <div class="puzzle-item-info">
                    <div class="puzzle-item-name">${puzzle.name}</div>
                    <div class="puzzle-item-type">${puzzle.type} • ${puzzle.difficulty}</div>
                </div>
                <div class="puzzle-item-status">${Storage.isPuzzleSolved(puzzle.id) ? '✅' : ''}</div>
            `;
            
            item.addEventListener('click', () => loadPuzzle(puzzle.id));
            elements.puzzleList.appendChild(item);
        });
    }

    /**
     * Load specific puzzle
     */
    function loadPuzzle(puzzleId) {
        currentPuzzle = PUZZLES.find(p => p.id === puzzleId);
        if (!currentPuzzle) return;
        
        currentMoveIndex = 0;
        selectedSquare = null;
        legalMoves = [];
        
        // Load position
        game.load(currentPuzzle.fen);
        
        // Update UI
        elements.puzzleTitle.textContent = currentPuzzle.name;
        elements.puzzleDifficulty.textContent = currentPuzzle.difficulty;
        elements.puzzleDifficulty.className = 'puzzle-difficulty ' + currentPuzzle.difficulty;
        elements.puzzleRating.textContent = `Rating: ${currentPuzzle.rating}`;
        elements.puzzleObjective.textContent = getObjectiveText(currentPuzzle.type);
        elements.hintText.textContent = '';
        
        // Update puzzle list selection
        document.querySelectorAll('.puzzle-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.id) === puzzleId) {
                item.classList.add('active');
            }
        });
        
        // Determine orientation
        isFlipped = game.turn() === 'b';
        
        updateBoard();
        updateProgress();
    }

    /**
     * Load next unsolved puzzle
     */
    function loadNextPuzzle() {
        const unsolved = PUZZLES.filter(p => !Storage.isPuzzleSolved(p.id));
        if (unsolved.length > 0) {
            loadPuzzle(unsolved[0].id);
        } else {
            // All puzzles solved
            loadPuzzle(PUZZLES[0].id);
        }
    }

    /**
     * Get objective text
     */
    function getObjectiveText(type) {
        switch (type) {
            case 'mate1': return 'Find the checkmate in 1 move';
            case 'mate2': return 'Find checkmate in 2 moves';
            case 'tactical': return 'Find the best tactical move';
            default: return 'Find the best move';
        }
    }

    /**
     * Update board display
     */
    function updateBoard() {
        const boardState = game.board();
        
        document.querySelectorAll('.board-square').forEach(square => {
            square.textContent = '';
            square.classList.remove('selected', 'legal-move', 'legal-capture');
        });
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = boardState[row][col];
                if (piece) {
                    const square = getSquareElement(row, col);
                    square.textContent = getPieceSymbol(piece);
                    square.draggable = true;
                    square.addEventListener('dragstart', (e) => onDragStart(e, row, col));
                }
            }
        }
        
        if (selectedSquare) {
            getSquareElement(selectedSquare.row, selectedSquare.col).classList.add('selected');
            legalMoves.forEach(move => {
                const coords = getSquareCoords(move.to);
                const square = getSquareElement(coords.row, coords.col);
                square.classList.add(move.captured ? 'legal-capture' : 'legal-move');
            });
        }
    }

    /**
     * Get piece symbol
     */
    function getPieceSymbol(piece) {
        const symbols = {
            w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
            b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
        };
        return symbols[piece.color][piece.type];
    }

    /**
     * Get square element
     */
    function getSquareElement(row, col) {
        return elements.board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    /**
     * Handle square click
     */
    function onSquareClick(row, col) {
        if (game.game_over()) return;
        
        const notation = getSquareNotation(row, col);
        const piece = game.get(notation);
        
        if (selectedSquare) {
            const fromNotation = getSquareNotation(selectedSquare.row, selectedSquare.col);
            const move = legalMoves.find(m => m.to === notation);
            
            if (move) {
                attemptMove(fromNotation, notation, move.promotion);
                return;
            }
            
            if (selectedSquare.row === row && selectedSquare.col === col) {
                selectedSquare = null;
                legalMoves = [];
                updateBoard();
                return;
            }
        }
        
        if (piece && piece.color === game.turn()) {
            selectedSquare = { row, col };
            legalMoves = game.moves({ square: notation, verbose: true });
            updateBoard();
        }
    }

    /**
     * Handle drag start
     */
    function onDragStart(e, row, col) {
        const notation = getSquareNotation(row, col);
        const piece = game.get(notation);
        
        if (!piece || piece.color !== game.turn()) {
            e.preventDefault();
            return;
        }
        
        selectedSquare = { row, col };
        legalMoves = game.moves({ square: notation, verbose: true });
        e.dataTransfer.setData('text/plain', notation);
        updateBoard();
    }

    /**
     * Handle drag over
     */
    function onDragOver(e) {
        e.preventDefault();
    }

    /**
     * Handle drop
     */
    function onDrop(e, row, col) {
        e.preventDefault();
        const fromNotation = e.dataTransfer.getData('text/plain');
        const toNotation = getSquareNotation(row, col);
        
        const move = legalMoves.find(m => m.to === toNotation);
        if (move) {
            attemptMove(fromNotation, toNotation, move.promotion);
        }
    }

    /**
     * Attempt a move
     */
    function attemptMove(from, to, promotion = null) {
        const moveConfig = { from, to };
        
        const piece = game.get(from);
        if (piece && piece.type === 'p') {
            const toRank = to.charAt(1);
            if (toRank === '8' || toRank === '1') {
                if (!promotion) {
                    // Auto-promote to queen for puzzles
                    moveConfig.promotion = 'q';
                } else {
                    moveConfig.promotion = promotion;
                }
            }
        }
        
        const move = game.move(moveConfig);
        
        if (move) {
            const moveNotation = move.san;
            const expectedMove = currentPuzzle.solution[currentMoveIndex];
            
            if (moveNotation === expectedMove || moveNotation.replace('#', '').replace('+', '') === expectedMove.replace('#', '').replace('+', '')) {
                // Correct move
                SoundManager.playMove();
                
                if (move.captured) SoundManager.playCapture();
                if (game.in_check()) SoundManager.playCheck();
                
                currentMoveIndex++;
                selectedSquare = null;
                legalMoves = [];
                updateBoard();
                
                // Check if puzzle is complete
                if (currentMoveIndex >= currentPuzzle.solution.length) {
                    handlePuzzleSuccess();
                } else {
                    // Make opponent's move for mate in 2
                    setTimeout(() => {
                        makeOpponentMove();
                    }, 500);
                }
            } else {
                // Wrong move
                handlePuzzleFailure();
            }
        }
    }

    /**
     * Make opponent's move (for mate in 2 puzzles)
     */
    function makeOpponentMove() {
        // For simplicity, just undo and let player try again
        // In a full implementation, we'd have the opponent's moves in the puzzle data
        game.undo();
        updateBoard();
    }

    /**
     * Handle puzzle success
     */
    function handlePuzzleSuccess() {
        SoundManager.playWin();
        
        // Mark as solved
        Storage.markPuzzleSolved(currentPuzzle.id);
        Storage.recordPuzzleSolve();
        
        // Update progress
        puzzleProgress = Storage.getPuzzleProgress();
        updateStats();
        updateProgress();
        loadPuzzleList();
        
        // Show success feedback
        elements.puzzleFeedback.textContent = '✓';
        elements.puzzleFeedback.className = 'puzzle-feedback success';
        
        setTimeout(() => {
            elements.puzzleFeedback.className = 'puzzle-feedback';
            showSuccessModal();
        }, 1000);
    }

    /**
     * Handle puzzle failure
     */
    function handlePuzzleFailure() {
        SoundManager.playIllegal();
        Storage.recordPuzzleFail();
        puzzleProgress = Storage.getPuzzleProgress();
        updateStats();
        
        // Show error feedback
        elements.puzzleFeedback.textContent = '✗';
        elements.puzzleFeedback.className = 'puzzle-feedback error';
        
        // Shake board
        elements.board.classList.add('shake');
        setTimeout(() => {
            elements.board.classList.remove('shake');
            elements.puzzleFeedback.className = 'puzzle-feedback';
        }, 500);
        
        // Reset position
        setTimeout(() => {
            game.load(currentPuzzle.fen);
            currentMoveIndex = 0;
            selectedSquare = null;
            legalMoves = [];
            updateBoard();
            showFailureModal();
        }, 1000);
    }

    /**
     * Show success modal
     */
    function showSuccessModal() {
        const modal = elements.successModal;
        document.getElementById('successRating').textContent = '+' + (15 + Math.floor(Math.random() * 10));
        document.getElementById('successStreak').textContent = puzzleProgress.streak;
        
        modal.classList.add('active');
        startConfetti();
    }

    /**
     * Show failure modal
     */
    function showFailureModal() {
        const modal = elements.failureModal;
        document.getElementById('correctMove').textContent = currentPuzzle.solution[0];
        modal.classList.add('active');
    }

    /**
     * Update stats display
     */
    function updateStats() {
        const stats = Storage.getStatistics();
        elements.solvedCount.textContent = stats.puzzlesSolved;
        elements.streakCount.textContent = puzzleProgress.streak;
        elements.ratingDisplay.textContent = puzzleProgress.currentRating;
    }

    /**
     * Update progress bar
     */
    function updateProgress() {
        const solved = puzzleProgress.solved.length;
        const total = PUZZLES.length;
        const percentage = (solved / total) * 100;
        
        elements.progressFill.style.width = percentage + '%';
        elements.progressText.textContent = `${solved}/${total} puzzles solved`;
    }

    /**
     * Apply theme
     */
    function applyTheme(theme) {
        document.querySelectorAll('.board-square').forEach(square => {
            square.classList.remove('classic', 'blue', 'green', 'purple', 'dark');
            square.classList.add(theme);
        });
    }

    /**
     * Bind events
     */
    function bindEvents() {
        // Hint button
        document.getElementById('hintBtn').addEventListener('click', showHint);
        document.getElementById('mobileHint')?.addEventListener('click', showHint);
        
        // Next puzzle
        document.getElementById('nextPuzzleBtn').addEventListener('click', () => {
            closeSuccessModal();
            loadNextPuzzle();
        });
        
        // Skip puzzle
        document.getElementById('skipPuzzleBtn').addEventListener('click', () => {
            loadNextPuzzle();
        });
        document.getElementById('mobileSkip')?.addEventListener('click', () => {
            loadNextPuzzle();
        });
        
        // Reset puzzle
        document.getElementById('mobileReset')?.addEventListener('click', () => {
            game.load(currentPuzzle.fen);
            currentMoveIndex = 0;
            selectedSquare = null;
            legalMoves = [];
            updateBoard();
        });
        
        // Continue after success
        document.getElementById('continueBtn').addEventListener('click', () => {
            closeSuccessModal();
            loadNextPuzzle();
        });
        
        // Try again after failure
        document.getElementById('tryAgainBtn').addEventListener('click', () => {
            closeFailureModal();
        });
        
        // Next after fail
        document.getElementById('nextAfterFailBtn').addEventListener('click', () => {
            closeFailureModal();
            loadNextPuzzle();
        });
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterPuzzles(btn.dataset.filter);
            });
        });
        
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
     * Show hint
     */
    function showHint() {
        if (currentPuzzle) {
            elements.hintText.textContent = currentPuzzle.hint;
        }
    }

    /**
     * Filter puzzles
     */
    function filterPuzzles(filter) {
        const items = document.querySelectorAll('.puzzle-item');
        
        items.forEach(item => {
            const puzzle = PUZZLES.find(p => p.id === parseInt(item.dataset.id));
            if (filter === 'all' || puzzle.type === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    /**
     * Close modals
     */
    window.closeSuccessModal = function() {
        elements.successModal.classList.remove('active');
        stopConfetti();
    };

    window.closeFailureModal = function() {
        elements.failureModal.classList.remove('active');
    };

    window.closeCompleteModal = function() {
        elements.completeModal.classList.remove('active');
    };

    window.restartPuzzles = function() {
        closeCompleteModal();
        loadPuzzle(PUZZLES[0].id);
    };

    /**
     * Confetti effect
     */
    let confettiId = null;
    
    function startConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const colors = ['#6366F1', '#22D3EE', '#22C55E', '#F59E0B', '#EF4444'];
        
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -Math.random() * canvas.height,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
                
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            
            confettiId = requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    function stopConfetti() {
        if (confettiId) {
            cancelAnimationFrame(confettiId);
            confettiId = null;
        }
        const canvas = document.getElementById('confettiCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
