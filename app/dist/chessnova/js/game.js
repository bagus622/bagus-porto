/**
 * ChessNova - Game Module
 * Main game logic and UI interactions
 */

(function() {
    'use strict';

    // Game state
    let game = null;
    let board = null;
    let selectedSquare = null;
    let legalMoves = [];
    let moveHistory = [];
    let currentMoveIndex = -1;
    let isFlipped = false;
    let gameMode = 'pvp'; // 'pvp' or 'ai'
    let playerColor = 'w';
    let isAIThinking = false;
    let hintSquare = null;
    let lastMove = null;
    let capturedPieces = { w: [], b: [] };

    // Settings
    let settings = {};

    // DOM Elements
    const elements = {};

    /**
     * Initialize the game
     */
    function init() {
        // Load settings
        settings = Storage.getSettings();
        
        // Initialize chess.js
        game = new Chess();
        
        // Cache DOM elements
        cacheElements();
        
        // Parse URL parameters
        parseUrlParams();
        
        // Create board
        createBoard();
        
        // Initialize timer
        initTimer();
        
        // Bind events
        bindEvents();
        
        // Update UI
        updateBoard();
        updateStatus();
        
        // Load saved game if exists
        loadSavedGame();
        
        // Apply theme
        applyTheme();
        
        console.log('ChessNova Game initialized');
    }

    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements.board = document.getElementById('chessBoard');
        elements.boardContainer = document.getElementById('boardContainer');
        elements.boardOverlay = document.getElementById('boardOverlay');
        elements.checkIndicator = document.getElementById('checkIndicator');
        elements.moveHistory = document.getElementById('historyList');
        elements.statusText = document.querySelector('.status-text');
        elements.turnIndicator = document.getElementById('turnIndicator');
        elements.playerTimer = document.getElementById('playerTimer');
        elements.opponentTimer = document.getElementById('opponentTimer');
        elements.capturedByWhite = document.getElementById('capturedByWhite');
        elements.capturedByBlack = document.getElementById('capturedByBlack');
        elements.materialAdvantage = document.getElementById('materialAdvantage');
        elements.gameModeIndicator = document.getElementById('gameModeIndicator');
        elements.playerName = document.getElementById('playerName');
        elements.opponentName = document.getElementById('opponentName');
        elements.playerAvatar = document.getElementById('playerAvatar');
        elements.opponentAvatar = document.getElementById('opponentAvatar');
        elements.newGameModal = document.getElementById('newGameModal');
        elements.settingsModal = document.getElementById('settingsModal');
        elements.gameOverModal = document.getElementById('gameOverModal');
        elements.promotionModal = document.getElementById('promotionModal');
    }

    /**
     * Parse URL parameters
     */
    function parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        
        if (mode === 'ai') {
            gameMode = 'ai';
            elements.gameModeIndicator.textContent = 'vs AI';
            elements.opponentName.textContent = 'Computer';
            elements.opponentAvatar.textContent = '🤖';
        } else {
            gameMode = 'pvp';
            elements.gameModeIndicator.textContent = 'vs Player';
            elements.opponentName.textContent = 'Player 2';
            elements.opponentAvatar.textContent = '👤';
        }
        
        // Load profile
        const profile = Storage.getProfile();
        elements.playerName.textContent = profile.username;
        elements.playerAvatar.textContent = profile.avatar;
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
                
                // Set square color
                const isLight = (row + col) % 2 === 0;
                square.classList.add(isLight ? 'light' : 'dark');
                square.classList.add(settings.boardTheme);
                
                // Add notation
                const notation = getSquareNotation(row, col);
                square.dataset.square = notation;
                
                // Bind events
                square.addEventListener('click', () => onSquareClick(row, col));
                square.addEventListener('dragover', onDragOver);
                square.addEventListener('drop', (e) => onDrop(e, row, col));
                
                elements.board.appendChild(square);
            }
        }
    }

    /**
     * Get algebraic notation from row/col
     */
    function getSquareNotation(row, col) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        
        if (isFlipped) {
            return files[7 - col] + ranks[7 - row];
        }
        return files[col] + ranks[row];
    }

    /**
     * Get row/col from algebraic notation
     */
    function getSquareCoords(notation) {
        const files = 'abcdefgh';
        const ranks = '87654321';
        
        const col = files.indexOf(notation[0]);
        const row = ranks.indexOf(notation[1]);
        
        if (isFlipped) {
            return { row: 7 - row, col: 7 - col };
        }
        return { row, col };
    }

    /**
     * Update board display
     */
    function updateBoard() {
        const boardState = game.board();
        
        // Clear all squares
        document.querySelectorAll('.board-square').forEach(square => {
            square.textContent = '';
            square.classList.remove('selected', 'last-move', 'legal-move', 'legal-capture', 'check', 'checkmate', 'hint');
        });
        
        // Place pieces
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
        
        // Highlight last move
        if (lastMove && settings.showLastMove) {
            const from = getSquareCoords(lastMove.from);
            const to = getSquareCoords(lastMove.to);
            getSquareElement(from.row, from.col).classList.add('last-move');
            getSquareElement(to.row, to.col).classList.add('last-move');
        }
        
        // Highlight selected square and legal moves
        if (selectedSquare && settings.showLegalMoves) {
            getSquareElement(selectedSquare.row, selectedSquare.col).classList.add('selected');
            
            legalMoves.forEach(move => {
                const coords = getSquareCoords(move.to);
                const square = getSquareElement(coords.row, coords.col);
                square.classList.add(move.captured ? 'legal-capture' : 'legal-move');
            });
        }
        
        // Highlight hint
        if (hintSquare) {
            const coords = getSquareCoords(hintSquare);
            getSquareElement(coords.row, coords.col).classList.add('hint');
        }
        
        // Highlight check/checkmate
        if (game.in_check()) {
            const kingSquare = findKing(game.turn());
            if (kingSquare) {
                const coords = getSquareCoords(kingSquare);
                const square = getSquareElement(coords.row, coords.col);
                square.classList.add(game.in_checkmate() ? 'checkmate' : 'check');
            }
            
            if (game.in_checkmate()) {
                elements.checkIndicator.textContent = 'CHECKMATE';
                elements.checkIndicator.classList.add('active');
            } else {
                elements.checkIndicator.textContent = 'CHECK';
                elements.checkIndicator.classList.add('active');
                setTimeout(() => elements.checkIndicator.classList.remove('active'), 2000);
            }
        }
        
        // Update captured pieces
        updateCapturedPieces();
    }

    /**
     * Get piece symbol
     */
    function getPieceSymbol(piece) {
        if (settings.pieceStyle === 'letters') {
            const letters = { k: 'K', q: 'Q', r: 'R', b: 'B', n: 'N', p: 'P' };
            const letter = letters[piece.type];
            return piece.color === 'w' ? letter : letter.toLowerCase();
        }
        
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
     * Find king position
     */
    function findKing(color) {
        const board = game.board();
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece.type === 'k' && piece.color === color) {
                    const files = 'abcdefgh';
                    const ranks = '87654321';
                    return files[col] + ranks[row];
                }
            }
        }
        return null;
    }

    /**
     * Handle square click
     */
    function onSquareClick(row, col) {
        if (isAIThinking) return;
        if (game.game_over()) return;
        
        const notation = getSquareNotation(row, col);
        const piece = game.get(notation);
        
        // If a square is already selected
        if (selectedSquare) {
            const fromNotation = getSquareNotation(selectedSquare.row, selectedSquare.col);
            
            // Check if clicking on a legal move target
            const move = legalMoves.find(m => m.to === notation);
            
            if (move) {
                // Make the move
                makeMove(fromNotation, notation, move.promotion);
                return;
            }
            
            // Deselect if clicking same square
            if (selectedSquare.row === row && selectedSquare.col === col) {
                selectedSquare = null;
                legalMoves = [];
                updateBoard();
                return;
            }
        }
        
        // Select piece if it belongs to current player
        if (piece && piece.color === game.turn()) {
            // In AI mode, only allow moving player's pieces
            if (gameMode === 'ai' && game.turn() !== playerColor) {
                return;
            }
            
            selectedSquare = { row, col };
            legalMoves = game.moves({ square: notation, verbose: true });
            hintSquare = null;
            updateBoard();
        } else {
            selectedSquare = null;
            legalMoves = [];
            updateBoard();
        }
    }

    /**
     * Handle drag start
     */
    function onDragStart(e, row, col) {
        if (isAIThinking) {
            e.preventDefault();
            return;
        }
        if (game.game_over()) {
            e.preventDefault();
            return;
        }
        
        const notation = getSquareNotation(row, col);
        const piece = game.get(notation);
        
        if (!piece || piece.color !== game.turn()) {
            e.preventDefault();
            return;
        }
        
        // In AI mode, only allow moving player's pieces
        if (gameMode === 'ai' && game.turn() !== playerColor) {
            e.preventDefault();
            return;
        }
        
        selectedSquare = { row, col };
        legalMoves = game.moves({ square: notation, verbose: true });
        e.dataTransfer.setData('text/plain', notation);
        e.target.classList.add('dragging');
        updateBoard();
    }

    /**
     * Handle drag over
     */
    function onDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    /**
     * Handle drop
     */
    function onDrop(e, row, col) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        const fromNotation = e.dataTransfer.getData('text/plain');
        const toNotation = getSquareNotation(row, col);
        
        const move = legalMoves.find(m => m.to === toNotation);
        if (move) {
            makeMove(fromNotation, toNotation, move.promotion);
        }
        
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    }

    /**
     * Make a move
     */
    function makeMove(from, to, promotion = null) {
        const moveConfig = { from, to };
        
        // Check if promotion is needed
        const piece = game.get(from);
        if (piece && piece.type === 'p') {
            const toRank = to.charAt(1);
            if (toRank === '8' || toRank === '1') {
                if (!promotion) {
                    showPromotionModal(from, to);
                    return;
                }
                moveConfig.promotion = promotion;
            }
        }
        
        // Make the move
        const move = game.move(moveConfig);
        
        if (move) {
            // Play sound
            if (move.captured) {
                SoundManager.playCapture();
                // Track captured piece
                const capturedColor = move.color === 'w' ? 'b' : 'w';
                capturedPieces[capturedColor].push(move.captured);
            } else if (move.flags.includes('k') || move.flags.includes('q')) {
                SoundManager.playCastle();
            } else {
                SoundManager.playMove();
            }
            
            if (game.in_check()) {
                setTimeout(() => SoundManager.playCheck(), 200);
            }
            
            // Update state
            lastMove = { from: move.from, to: move.to };
            selectedSquare = null;
            legalMoves = [];
            hintSquare = null;
            
            // Add to history
            addMoveToHistory(move);
            
            // Switch timer
            Timer.switchTurn();
            
            // Update UI
            updateBoard();
            updateStatus();
            
            // Save game
            saveGame();
            
            // Check game end
            if (game.game_over()) {
                handleGameOver();
                return;
            }
            
            // AI move
            if (gameMode === 'ai' && game.turn() !== playerColor) {
                makeAIMove();
            }
        }
    }

    /**
     * Show promotion modal
     */
    function showPromotionModal(from, to) {
        const modal = elements.promotionModal;
        modal.classList.add('active');
        
        const options = modal.querySelectorAll('.promotion-piece');
        options.forEach(btn => {
            btn.onclick = () => {
                modal.classList.remove('active');
                makeMove(from, to, btn.dataset.piece);
            };
        });
    }

    /**
     * Make AI move
     */
    function makeAIMove() {
        isAIThinking = true;
        elements.boardOverlay.classList.add('active');
        elements.turnIndicator.textContent = 'Computer thinking...';
        
        ChessAI.makeMove(game, (move) => {
            isAIThinking = false;
            elements.boardOverlay.classList.remove('active');
            
            if (move) {
                // Play sound
                const moveObj = game.history({ verbose: true }).pop();
                if (moveObj && moveObj.captured) {
                    SoundManager.playCapture();
                    capturedPieces[playerColor].push(moveObj.captured);
                } else {
                    SoundManager.playMove();
                }
                
                if (game.in_check()) {
                    setTimeout(() => SoundManager.playCheck(), 200);
                }
                
                lastMove = { from: moveObj.from, to: moveObj.to };
                addMoveToHistory(moveObj);
                Timer.switchTurn();
                updateBoard();
                updateStatus();
                saveGame();
                
                if (game.game_over()) {
                    handleGameOver();
                }
            }
        });
    }

    /**
     * Add move to history
     */
    function addMoveToHistory(move) {
        const moveNumber = Math.floor(game.history().length / 2) + (move.color === 'w' ? 0 : 1);
        const moveNotation = move.san;
        
        if (move.color === 'w') {
            moveHistory.push({
                number: moveNumber,
                white: moveNotation,
                black: null
            });
        } else {
            const lastEntry = moveHistory[moveHistory.length - 1];
            if (lastEntry) {
                lastEntry.black = moveNotation;
            }
        }
        
        currentMoveIndex = moveHistory.length - 1;
        updateMoveHistoryDisplay();
    }

    /**
     * Update move history display
     */
    function updateMoveHistoryDisplay() {
        elements.moveHistory.innerHTML = '';
        
        moveHistory.forEach((entry, index) => {
            const row = document.createElement('div');
            row.className = 'history-move';
            if (index === currentMoveIndex) {
                row.classList.add('active');
            }
            
            row.innerHTML = `
                <span class="history-move-number">${entry.number}.</span>
                <span>${entry.white || ''}</span>
                <span>${entry.black || ''}</span>
            `;
            
            row.addEventListener('click', () => goToMove(index));
            elements.moveHistory.appendChild(row);
        });
        
        // Scroll to bottom
        elements.moveHistory.scrollTop = elements.moveHistory.scrollHeight;
    }

    /**
     * Go to specific move
     */
    function goToMove(index) {
        // This would require maintaining a history of FEN positions
        // For now, just highlight the move
        currentMoveIndex = index;
        updateMoveHistoryDisplay();
    }

    /**
     * Update game status
     */
    function updateStatus() {
        const turn = game.turn() === 'w' ? 'White' : 'Black';
        
        if (game.in_checkmate()) {
            elements.statusText.textContent = 'Checkmate!';
            elements.turnIndicator.textContent = `${turn} is checkmated`;
        } else if (game.in_draw()) {
            elements.statusText.textContent = 'Draw';
            elements.turnIndicator.textContent = 'Game ended in a draw';
        } else if (game.in_stalemate()) {
            elements.statusText.textContent = 'Stalemate';
            elements.turnIndicator.textContent = 'Stalemate - Draw';
        } else if (game.in_threefold_repetition()) {
            elements.statusText.textContent = 'Draw';
            elements.turnIndicator.textContent = 'Threefold repetition';
        } else if (game.insufficient_material()) {
            elements.statusText.textContent = 'Draw';
            elements.turnIndicator.textContent = 'Insufficient material';
        } else {
            elements.statusText.textContent = `${turn} to move`;
            
            if (gameMode === 'ai') {
                if (game.turn() === playerColor) {
                    elements.turnIndicator.textContent = 'Your turn';
                } else {
                    elements.turnIndicator.textContent = 'Computer thinking...';
                }
            } else {
                elements.turnIndicator.textContent = `${turn}'s turn`;
            }
        }
        
        // Update timers
        updateTimerDisplay();
    }

    /**
     * Update timer display
     */
    function updateTimerDisplay() {
        const timeData = Timer.getTimeData();
        
        if (game.turn() === 'w') {
            elements.playerTimer.classList.toggle('active', playerColor === 'w');
            elements.opponentTimer.classList.toggle('active', playerColor === 'b');
        } else {
            elements.playerTimer.classList.toggle('active', playerColor === 'b');
            elements.opponentTimer.classList.toggle('active', playerColor === 'w');
        }
        
        // Add danger class for low time
        elements.playerTimer.classList.toggle('danger', timeData[playerColor === 'w' ? 'white' : 'black'].isCritical);
        elements.opponentTimer.classList.toggle('danger', timeData[playerColor === 'w' ? 'black' : 'white'].isCritical);
    }

    /**
     * Initialize timer
     */
    function initTimer() {
        Timer.init(10); // Default 10 minutes
        
        Timer.onTick((timeData) => {
            elements.playerTimer.textContent = playerColor === 'w' ? timeData.white.formatted : timeData.black.formatted;
            elements.opponentTimer.textContent = playerColor === 'w' ? timeData.black.formatted : timeData.white.formatted;
            updateTimerDisplay();
        });
        
        Timer.onTimeUp((color) => {
            handleTimeUp(color);
        });
    }

    /**
     * Handle time up
     */
    function handleTimeUp(color) {
        Timer.stop();
        SoundManager.playLose();
        
        const winner = color === 'w' ? 'Black' : 'White';
        showGameOver('timeout', `${winner} wins on time!`);
        
        // Record result
        if (gameMode === 'ai') {
            const result = (color !== playerColor) ? 'win' : 'loss';
            Storage.recordGame(result, {
                mode: 'ai',
                difficulty: ChessAI.getDifficulty(),
                reason: 'timeout'
            });
        }
    }

    /**
     * Handle game over
     */
    function handleGameOver() {
        Timer.stop();
        
        let result, message, title;
        
        if (game.in_checkmate()) {
            const winner = game.turn() === 'w' ? 'Black' : 'White';
            title = 'Checkmate!';
            message = `${winner} wins by checkmate!`;
            
            if (gameMode === 'ai') {
                result = (game.turn() !== playerColor) ? 'win' : 'loss';
            } else {
                result = game.turn() === 'w' ? 'loss' : 'win';
            }
            
            SoundManager.playCheckmate();
            setTimeout(() => {
                if (result === 'win') SoundManager.playWin();
                else SoundManager.playLose();
            }, 500);
        } else {
            title = 'Draw!';
            message = 'Game ended in a draw';
            result = 'draw';
            SoundManager.playDraw();
        }
        
        // Record result
        if (gameMode === 'ai') {
            Storage.recordGame(result, {
                mode: 'ai',
                difficulty: ChessAI.getDifficulty(),
                pgn: game.pgn()
            });
        }
        
        // Show game over modal
        setTimeout(() => {
            showGameOver(result, message, title);
        }, 500);
    }

    /**
     * Show game over modal
     */
    function showGameOver(result, message, title) {
        const modal = elements.gameOverModal;
        const icon = modal.querySelector('#gameOverIcon');
        const titleEl = modal.querySelector('#gameOverTitle');
        const messageEl = modal.querySelector('#gameOverMessage');
        const statsEl = modal.querySelector('#gameOverStats');
        
        icon.textContent = result === 'win' ? '🏆' : result === 'loss' ? '💔' : '🤝';
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        // Show stats
        const stats = Storage.getStatistics();
        statsEl.innerHTML = `
            <div>
                <div class="stat-value">${stats.wins}</div>
                <div class="stat-label">Wins</div>
            </div>
            <div>
                <div class="stat-value">${stats.winRate}%</div>
                <div class="stat-label">Win Rate</div>
            </div>
        `;
        
        modal.classList.add('active');
        
        // Confetti for win
        if (result === 'win') {
            startConfetti();
        }
    }

    /**
     * Update captured pieces display
     */
    function updateCapturedPieces() {
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9 };
        
        // Display captured pieces
        elements.capturedByWhite.innerHTML = capturedPieces.b
            .map(p => getPieceSymbol({ type: p, color: 'b' }))
            .join('');
        
        elements.capturedByBlack.innerHTML = capturedPieces.w
            .map(p => getPieceSymbol({ type: p, color: 'w' }))
            .join('');
        
        // Calculate material advantage
        const whiteValue = capturedPieces.b.reduce((sum, p) => sum + (pieceValues[p] || 0), 0);
        const blackValue = capturedPieces.w.reduce((sum, p) => sum + (pieceValues[p] || 0), 0);
        const advantage = whiteValue - blackValue;
        
        if (advantage !== 0) {
            const sign = advantage > 0 ? '+' : '';
            elements.materialAdvantage.textContent = `${sign}${advantage}`;
            elements.materialAdvantage.style.color = advantage > 0 ? 'var(--success)' : 'var(--danger)';
        } else {
            elements.materialAdvantage.textContent = '';
        }
    }

    /**
     * Save current game
     */
    function saveGame() {
        Storage.saveGame({
            fen: game.fen(),
            pgn: game.pgn(),
            mode: gameMode,
            playerColor: playerColor,
            moveHistory: moveHistory,
            capturedPieces: capturedPieces
        });
    }

    /**
     * Load saved game
     */
    function loadSavedGame() {
        const saved = Storage.getSavedGame();
        if (saved && saved.fen) {
            try {
                game.load(saved.fen);
                if (saved.moveHistory) {
                    moveHistory = saved.moveHistory;
                    updateMoveHistoryDisplay();
                }
                if (saved.capturedPieces) {
                    capturedPieces = saved.capturedPieces;
                }
                updateBoard();
                updateStatus();
            } catch (e) {
                console.warn('Failed to load saved game:', e);
            }
        }
    }

    /**
     * Apply theme
     */
    function applyTheme() {
        document.querySelectorAll('.board-square').forEach(square => {
            // Remove old theme classes
            square.classList.remove('classic', 'blue', 'green', 'purple', 'dark');
            // Add current theme
            square.classList.add(settings.boardTheme);
        });
    }

    /**
     * Bind events
     */
    function bindEvents() {
        // New game button
        document.getElementById('newGameBtn').addEventListener('click', showNewGameModal);
        
        // Start game button in modal
        document.getElementById('startGameBtn').addEventListener('click', startNewGame);
        
        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', showSettingsModal);
        
        // Sound toggle
        document.getElementById('soundBtn').addEventListener('click', () => {
            const enabled = SoundManager.toggle();
            document.getElementById('soundBtn').textContent = enabled ? '🔊' : '🔇';
        });
        
        // Undo button
        document.getElementById('undoBtn').addEventListener('click', undoMove);
        document.getElementById('mobileUndo')?.addEventListener('click', undoMove);
        
        // Redo button
        document.getElementById('redoBtn').addEventListener('click', redoMove);
        
        // Flip board
        document.getElementById('flipBtn').addEventListener('click', flipBoard);
        document.getElementById('mobileFlip')?.addEventListener('click', flipBoard);
        
        // Hint button
        document.getElementById('hintBtn').addEventListener('click', showHint);
        
        // Save game
        document.getElementById('saveGameBtn').addEventListener('click', () => {
            saveGame();
            showToast('Game saved!', 'success');
        });
        
        // Resign
        document.getElementById('resignBtn').addEventListener('click', resign);
        
        // Draw offer
        document.getElementById('drawBtn').addEventListener('click', offerDraw);
        
        // Mode options
        document.querySelectorAll('#modeOptions .option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#modeOptions .option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const difficultyGroup = document.getElementById('difficultyGroup');
                difficultyGroup.style.display = btn.dataset.mode === 'ai' ? 'block' : 'none';
            });
        });
        
        // Difficulty options
        document.querySelectorAll('#difficultyOptions .option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#difficultyOptions .option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Time options
        document.querySelectorAll('#timeOptions .option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#timeOptions .option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Color options
        document.querySelectorAll('#colorOptions .option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#colorOptions .option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Board theme options
        document.querySelectorAll('#boardThemes .theme-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('#boardThemes .theme-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });
        
        // Piece style options
        document.querySelectorAll('#pieceStyles .option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#pieceStyles .option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                undoMove();
            } else if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                redoMove();
            } else if (e.key === 'f' || e.key === 'F') {
                flipBoard();
            } else if (e.key === 'h' || e.key === 'H') {
                showHint();
            }
        });
    }

    /**
     * Show new game modal
     */
    function showNewGameModal() {
        elements.newGameModal.classList.add('active');
    }

    /**
     * Close new game modal
     */
    window.closeNewGameModal = function() {
        elements.newGameModal.classList.remove('active');
    };

    /**
     * Start new game
     */
    function startNewGame() {
        // Get selected options
        const modeBtn = document.querySelector('#modeOptions .option-btn.active');
        const diffBtn = document.querySelector('#difficultyOptions .option-btn.active');
        const timeBtn = document.querySelector('#timeOptions .option-btn.active');
        const colorBtn = document.querySelector('#colorOptions .option-btn.active');
        
        gameMode = modeBtn?.dataset.mode || 'pvp';
        const difficulty = diffBtn?.dataset.diff || 'medium';
        const timeMinutes = parseInt(timeBtn?.dataset.time || '10');
        const colorChoice = colorBtn?.dataset.color || 'random';
        
        // Set AI difficulty
        ChessAI.setDifficulty(difficulty);
        
        // Determine player color
        if (colorChoice === 'random') {
            playerColor = Math.random() < 0.5 ? 'w' : 'b';
        } else {
            playerColor = colorChoice;
        }
        
        // Reset game
        game.reset();
        moveHistory = [];
        currentMoveIndex = -1;
        capturedPieces = { w: [], b: [] };
        lastMove = null;
        selectedSquare = null;
        legalMoves = [];
        isAIThinking = false;
        
        // Reset timer
        Timer.init(timeMinutes);
        
        // Update UI
        updateBoard();
        updateMoveHistoryDisplay();
        updateStatus();
        
        // Update player info
        if (gameMode === 'ai') {
            elements.gameModeIndicator.textContent = 'vs AI';
            elements.opponentName.textContent = 'Computer';
            elements.opponentAvatar.textContent = '🤖';
        } else {
            elements.gameModeIndicator.textContent = 'vs Player';
            elements.opponentName.textContent = 'Player 2';
            elements.opponentAvatar.textContent = '👤';
        }
        
        // Flip board if playing black
        if (playerColor === 'b' && !isFlipped) {
            flipBoard();
        } else if (playerColor === 'w' && isFlipped) {
            flipBoard();
        }
        
        // Clear saved game
        Storage.clearSavedGame();
        
        // Close modal
        closeNewGameModal();
        
        // Start timer
        Timer.start();
        
        // If AI mode and player is black, AI moves first
        if (gameMode === 'ai' && playerColor === 'b') {
            makeAIMove();
        }
    }

    /**
     * Show settings modal
     */
    function showSettingsModal() {
        // Load current settings into modal
        const settings = Storage.getSettings();
        document.getElementById('soundToggle').checked = settings.soundEnabled;
        document.getElementById('legalMovesToggle').checked = settings.showLegalMoves;
        document.getElementById('lastMoveToggle').checked = settings.showLastMove;
        
        elements.settingsModal.classList.add('active');
    }

    /**
     * Close settings modal
     */
    window.closeSettingsModal = function() {
        elements.settingsModal.classList.remove('active');
    };

    /**
     * Save settings
     */
    window.saveSettings = function() {
        const boardTheme = document.querySelector('#boardThemes .theme-option.active')?.dataset.theme || 'classic';
        const pieceStyle = document.querySelector('#pieceStyles .option-btn.active')?.dataset.style || 'unicode';
        
        settings = {
            soundEnabled: document.getElementById('soundToggle').checked,
            showLegalMoves: document.getElementById('legalMovesToggle').checked,
            showLastMove: document.getElementById('lastMoveToggle').checked,
            boardTheme: boardTheme,
            pieceStyle: pieceStyle
        };
        
        Storage.saveSettings(settings);
        applyTheme();
        updateBoard();
        closeSettingsModal();
        showToast('Settings saved!', 'success');
    };

    /**
     * Undo move
     */
    function undoMove() {
        if (game.history().length === 0) return;
        
        // In AI mode, undo both player and AI moves
        if (gameMode === 'ai') {
            game.undo(); // Undo AI move
            game.undo(); // Undo player move
        } else {
            game.undo();
        }
        
        // Update history
        if (moveHistory.length > 0) {
            const lastEntry = moveHistory[moveHistory.length - 1];
            if (lastEntry.black) {
                lastEntry.black = null;
            } else {
                moveHistory.pop();
            }
        }
        
        lastMove = null;
        selectedSquare = null;
        legalMoves = [];
        
        updateBoard();
        updateMoveHistoryDisplay();
        updateStatus();
        saveGame();
    }

    /**
     * Redo move (not implemented - would need move stack)
     */
    function redoMove() {
        showToast('Redo not available', 'warning');
    }

    /**
     * Flip board
     */
    function flipBoard() {
        isFlipped = !isFlipped;
        createBoard();
        updateBoard();
    }

    /**
     * Show hint
     */
    function showHint() {
        if (game.game_over()) return;
        if (gameMode === 'ai' && game.turn() !== playerColor) return;
        
        const hint = ChessAI.getHint(game);
        if (hint) {
            hintSquare = hint;
            updateBoard();
            showToast('Hint: Try ' + hint, 'info');
            
            setTimeout(() => {
                hintSquare = null;
                updateBoard();
            }, 3000);
        }
    }

    /**
     * Resign
     */
    function resign() {
        if (game.game_over()) return;
        
        if (confirm('Are you sure you want to resign?')) {
            Timer.stop();
            
            if (gameMode === 'ai') {
                Storage.recordGame('loss', {
                    mode: 'ai',
                    difficulty: ChessAI.getDifficulty(),
                    reason: 'resign'
                });
            }
            
            showGameOver('loss', 'You resigned', 'Game Over');
        }
    }

    /**
     * Offer draw
     */
    function offerDraw() {
        if (game.game_over()) return;
        
        if (gameMode === 'ai') {
            // AI accepts draw in certain conditions
            const eval_ = ChessAI.evaluate(game);
            if (Math.abs(eval_) < 100 || game.in_draw() || game.moves().length < 10) {
                Timer.stop();
                Storage.recordGame('draw', {
                    mode: 'ai',
                    difficulty: ChessAI.getDifficulty(),
                    reason: 'agreement'
                });
                showGameOver('draw', 'Draw by agreement', 'Draw!');
            } else {
                showToast('Computer declined draw offer', 'warning');
            }
        } else {
            if (confirm('Offer draw?')) {
                Timer.stop();
                showGameOver('draw', 'Draw by agreement', 'Draw!');
            }
        }
    }

    /**
     * Analyze game
     */
    window.analyzeGame = function() {
        closeGameOverModal();
        showToast('Analysis feature coming soon!', 'info');
    };

    /**
     * New game from modal
     */
    window.newGameFromModal = function() {
        closeGameOverModal();
        showNewGameModal();
    };

    /**
     * Close game over modal
     */
    window.closeGameOverModal = function() {
        elements.gameOverModal.classList.remove('active');
        stopConfetti();
    };

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
                y: Math.random() * canvas.height - canvas.height,
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
