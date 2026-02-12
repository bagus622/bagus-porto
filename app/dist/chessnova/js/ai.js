/**
 * ChessNova - AI Module
 * Chess engine using minimax algorithm with alpha-beta pruning
 */

const ChessAI = (function() {
    'use strict';

    // Piece values for evaluation
    const PIECE_VALUES = {
        p: 100,   // Pawn
        n: 320,   // Knight
        b: 330,   // Bishop
        r: 500,   // Rook
        q: 900,   // Queen
        k: 20000  // King
    };

    // Position tables for piece-square evaluation
    // Higher values = better squares for the piece
    const POSITION_TABLES = {
        p: [ // Pawn
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ],
        n: [ // Knight
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ],
        b: [ // Bishop
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ],
        r: [ // Rook
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [0,  0,  0,  5,  5,  0,  0,  0]
        ],
        q: [ // Queen
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-5,  0,  5,  5,  5,  5,  0, -5],
            [0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ],
        k: [ // King (middle game)
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [20, 20,  0,  0,  0,  0, 20, 20],
            [20, 30, 10,  0,  0, 10, 30, 20]
        ],
        k_endgame: [ // King (endgame)
            [-50,-40,-30,-20,-20,-30,-40,-50],
            [-30,-20,-10,  0,  0,-10,-20,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-30,  0,  0,  0,  0,-30,-30],
            [-50,-30,-30,-30,-30,-30,-30,-50]
        ]
    };

    // Difficulty settings
    const DIFFICULTY = {
        easy: { depth: 2, randomness: 0.3 },
        medium: { depth: 3, randomness: 0.1 },
        hard: { depth: 4, randomness: 0 }
    };

    let currentDifficulty = 'medium';
    let thinkingTime = 500; // Minimum thinking time in ms

    /**
     * Set AI difficulty
     * @param {string} level - 'easy', 'medium', or 'hard'
     */
    function setDifficulty(level) {
        if (DIFFICULTY[level]) {
            currentDifficulty = level;
        }
    }

    /**
     * Get current difficulty
     * @returns {string}
     */
    function getDifficulty() {
        return currentDifficulty;
    }

    /**
     * Check if position is endgame (simplified check)
     * @param {Object} game - Chess.js game instance
     * @returns {boolean}
     */
    function isEndgame(game) {
        const fen = game.fen();
        const pieceCount = (fen.match(/[pnbrqk]/gi) || []).length;
        return pieceCount <= 10;
    }

    /**
     * Evaluate board position
     * @param {Object} game - Chess.js game instance
     * @returns {number} Score (positive = good for white, negative = good for black)
     */
    function evaluate(game) {
        if (game.in_checkmate()) {
            return game.turn() === 'w' ? -Infinity : Infinity;
        }
        
        if (game.in_draw() || game.in_stalemate() || game.in_threefold_repetition()) {
            return 0;
        }

        let score = 0;
        const board = game.board();
        const endgame = isEndgame(game);

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const pieceType = piece.type;
                    const isWhite = piece.color === 'w';
                    
                    // Base piece value
                    let pieceScore = PIECE_VALUES[pieceType];
                    
                    // Position bonus
                    let positionTable = POSITION_TABLES[pieceType];
                    if (pieceType === 'k' && endgame) {
                        positionTable = POSITION_TABLES.k_endgame;
                    }
                    
                    // Mirror row for black pieces
                    const rowIndex = isWhite ? 7 - row : row;
                    pieceScore += positionTable[rowIndex][col];
                    
                    // Add or subtract from total score
                    score += isWhite ? pieceScore : -pieceScore;
                }
            }
        }

        // Mobility bonus
        const mobility = game.moves().length;
        score += game.turn() === 'w' ? mobility * 5 : -mobility * 5;

        // Check bonus
        if (game.in_check()) {
            score += game.turn() === 'w' ? -50 : 50;
        }

        return score;
    }

    /**
     * Minimax algorithm with alpha-beta pruning
     * @param {Object} game - Chess.js game instance
     * @param {number} depth - Search depth
     * @param {number} alpha - Alpha value
     * @param {number} beta - Beta value
     * @param {boolean} isMaximizing - Whether we're maximizing
     * @returns {number} Best score
     */
    function minimax(game, depth, alpha, beta, isMaximizing) {
        if (depth === 0 || game.game_over()) {
            return evaluate(game);
        }

        const moves = game.moves();
        
        // Sort moves for better pruning (captures first)
        moves.sort((a, b) => {
            const aIsCapture = a.includes('x');
            const bIsCapture = b.includes('x');
            return bIsCapture - aIsCapture;
        });

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                game.move(move);
                const eval_ = minimax(game, depth - 1, alpha, beta, false);
                game.undo();
                maxEval = Math.max(maxEval, eval_);
                alpha = Math.max(alpha, eval_);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                game.move(move);
                const eval_ = minimax(game, depth - 1, alpha, beta, true);
                game.undo();
                minEval = Math.min(minEval, eval_);
                beta = Math.min(beta, eval_);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    /**
     * Find the best move
     * @param {Object} game - Chess.js game instance
     * @returns {string} Best move in algebraic notation
     */
    function findBestMove(game) {
        const moves = game.moves();
        if (moves.length === 0) return null;
        
        if (moves.length === 1) return moves[0];

        const settings = DIFFICULTY[currentDifficulty];
        const isMaximizing = game.turn() === 'w';
        
        let bestMove = moves[0];
        let bestValue = isMaximizing ? -Infinity : Infinity;
        
        // Evaluate each move
        const moveScores = [];
        
        for (const move of moves) {
            game.move(move);
            const value = minimax(game, settings.depth - 1, -Infinity, Infinity, !isMaximizing);
            game.undo();
            
            moveScores.push({ move, value });
            
            if (isMaximizing) {
                if (value > bestValue) {
                    bestValue = value;
                    bestMove = move;
                }
            } else {
                if (value < bestValue) {
                    bestValue = value;
                    bestMove = move;
                }
            }
        }

        // Add randomness for lower difficulties
        if (settings.randomness > 0 && Math.random() < settings.randomness) {
            // Pick from top 3 moves randomly
            moveScores.sort((a, b) => isMaximizing ? b.value - a.value : a.value - b.value);
            const topMoves = moveScores.slice(0, Math.min(3, moveScores.length));
            bestMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;
        }

        return bestMove;
    }

    /**
     * Make AI move with delay for realism
     * @param {Object} game - Chess.js game instance
     * @param {Function} callback - Callback with the move
     */
    function makeMove(game, callback) {
        const startTime = Date.now();
        const bestMove = findBestMove(game);
        
        // Calculate delay for realism
        const elapsed = Date.now() - startTime;
        const delay = Math.max(thinkingTime - elapsed, 100);
        
        setTimeout(() => {
            if (bestMove) {
                game.move(bestMove);
                if (callback) callback(bestMove);
            }
        }, delay);
    }

    /**
     * Get hint for player
     * @param {Object} game - Chess.js game instance
     * @returns {string} Suggested move
     */
    function getHint(game) {
        // Use higher depth for hints
        const originalDifficulty = currentDifficulty;
        currentDifficulty = 'hard';
        const hint = findBestMove(game);
        currentDifficulty = originalDifficulty;
        return hint;
    }

    /**
     * Evaluate move quality
     * @param {Object} game - Chess.js game instance
     * @param {string} move - Move to evaluate
     * @returns {string} Quality rating
     */
    function evaluateMove(game, move) {
        const beforeEval = evaluate(game);
        game.move(move);
        const afterEval = evaluate(game);
        game.undo();
        
        const diff = game.turn() === 'w' ? afterEval - beforeEval : beforeEval - afterEval;
        
        if (diff > 200) return 'excellent';
        if (diff > 100) return 'good';
        if (diff > -50) return 'inaccurate';
        return 'mistake';
    }

    /**
     * Set thinking time
     * @param {number} ms - Thinking time in milliseconds
     */
    function setThinkingTime(ms) {
        thinkingTime = ms;
    }

    /**
     * Get thinking time
     * @returns {number}
     */
    function getThinkingTime() {
        return thinkingTime;
    }

    // Public API
    return {
        setDifficulty,
        getDifficulty,
        findBestMove,
        makeMove,
        getHint,
        evaluateMove,
        evaluate,
        setThinkingTime,
        getThinkingTime
    };
})();

// Make available globally
window.ChessAI = ChessAI;
