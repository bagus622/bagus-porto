# ChessNova - Modern Chess Platform

ChessNova adalah platform catur modern yang dibangun dengan HTML, CSS, dan Vanilla JavaScript. Tidak memerlukan backend atau database - semua data disimpan di localStorage.

## Fitur

### Game Modes
- **Play vs Player (Local)** - Bermain dengan teman di perangkat yang sama
- **Play vs AI** - Tantang AI dengan 3 tingkat kesulitan (Easy, Medium, Hard)
- **Puzzle Mode** - Latihan taktis dengan puzzle checkmate
- **Online Mode (Dummy UI)** - Simulasi UI multiplayer

### Fitur Game
- Drag & drop pieces
- Highlight legal moves
- Undo/Redo moves
- Flip board
- Move history dengan notasi PGN
- Captured pieces display
- Material advantage calculator
- Timer system (1 min, 5 min, 10 min, unlimited)

### AI
- Minimax algorithm dengan alpha-beta pruning
- Piece-square tables untuk evaluasi posisi
- 3 tingkat kesulitan:
  - Easy: Depth 2, 30% randomness
  - Medium: Depth 3, 10% randomness
  - Hard: Depth 4, no randomness

### Puzzle Mode
- 12 predefined puzzles
- Mate in 1, Mate in 2, dan Tactical puzzles
- Rating system
- Streak tracking
- Hint system

### Profile & Statistics
- Customizable username dan avatar
- Game statistics (wins, losses, draws, win rate)
- Rating history dengan chart
- Game history
- Achievement system

### Settings
- Board themes (Classic, Blue, Green, Purple, Dark)
- Piece styles (Unicode, Letters)
- Sound effects on/off
- Show legal moves toggle
- Show last move toggle

### Sound Effects
- Move sound
- Capture sound
- Check sound
- Checkmate sound
- Castle sound
- Promotion sound
- Win/Lose/Draw sounds

## Struktur Folder

```
/chessnova
│── index.html          # Landing page
│── game.html           # Game board page
│── profile.html        # Profile & statistics
│── puzzle.html         # Puzzle mode
│── README.md           # Dokumentasi
│── /css
│     └── style.css     # Stylesheet utama
│── /js
│     ├── main.js       # Landing page logic
│     ├── game.js       # Game logic
│     ├── ai.js         # AI engine (minimax)
│     ├── timer.js      # Timer system
│     ├── storage.js    # localStorage management
│     ├── sound.js      # Sound effects
│     ├── puzzle.js     # Puzzle mode logic
│     └── profile.js    # Profile page logic
│── /assets
      ├── sounds/       # Sound files (optional)
      └── pieces/       # Piece images (optional)
```

## Cara Menggunakan

1. Buka `index.html` di browser
2. Pilih game mode:
   - "Play vs Player" untuk bermain dengan teman
   - "Play vs AI" untuk melawan komputer
   - "Puzzle Mode" untuk latihan taktis
3. Atur settings sesuai preferensi
4. Mainkan!

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo move |
| Ctrl+Y | Redo move |
| F | Flip board |
| H | Show hint |
| Esc | Close modal |

## Data Storage

Semua data disimpan di localStorage browser:
- Settings
- Profile
- Game statistics
- Game history
- Saved games
- Puzzle progress
- Achievements

## Dependencies

- [chess.js](https://github.com/jhlywa/chess.js) - Chess logic library (loaded from CDN)
- Google Fonts - Inter & Poppins

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (responsive design)

## Kustomisasi

### Menambah Puzzle Baru

Edit file `js/puzzle.js` dan tambahkan puzzle ke array `PUZZLES`:

```javascript
{
    id: 13,
    name: "Puzzle Name",
    type: "mate1", // mate1, mate2, tactical
    difficulty: "easy", // easy, medium, hard
    rating: 1000,
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    solution: ["e4", "e5"], // Array of moves
    hint: "Hint text"
}
```

### Mengubah Tema Warna

Edit CSS variables di `css/style.css`:

```css
:root {
    --primary: #6366F1;
    --accent: #22D3EE;
    --bg-primary: #0F0F1A;
    --bg-secondary: #1A1A2E;
    /* ... */
}
```

### Mengubah AI Difficulty

Edit file `js/ai.js`:

```javascript
const DIFFICULTY = {
    easy: { depth: 2, randomness: 0.3 },
    medium: { depth: 3, randomness: 0.1 },
    hard: { depth: 4, randomness: 0 }
};
```

## Tips

- Gunakan hint ( tombol 💡 ) jika stuck
- AI akan berpikir lebih lama di difficulty Hard
- Semua game otomatis tersimpan
- Export data di profile page untuk backup

## License

MIT License - Feel free to use and modify!

---

Made with ❤️ for chess lovers everywhere
