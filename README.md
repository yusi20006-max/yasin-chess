# Yasin Chess

Professional, modular chess application for Persian/English users. Phase 1 contains a FIDE-oriented rules core, SAN/PGN history, FEN support, undo/redo, legal-move highlighting, difficulty profiles, and a local Minimax/Alpha-Beta engine. The architecture is ready for Stockfish WASM, PWA, online play, clocks, puzzles, analysis, themes, achievements, and persistence.

## Stack
- React + TypeScript + Vite
- Pure TypeScript chess rules engine (no UI dependency)
- Vitest tests
- Engine abstraction prepared for Stockfish integration

## Difficulty
- Beginner: depth 2, Elo target ~800, hints/explanations enabled
- Intermediate: depth 4, Elo target ~1400
- Advanced: depth 8, Elo target ~1900
- Master/Expert: depth 14, Elo target ~2800 (profile; production should use Stockfish for this level)
- Custom: depth 1–20

## Run
```bash
npm install
npm run test
npm run dev
```

## Roadmap
1. Phase 1 — core + difficulty (current)
2. Phase 2 — Stockfish WASM adapter + evaluation bar
3. Phase 3 — complete responsive UI, clocks, themes, sounds, FEN/PGN import/export
4. Phase 4 — analysis mode, puzzles, coaching and mistake explanations
5. Phase 5 — local Elo, persistence, replay and achievements
6. Phase 6 — PWA/offline
7. Phase 7 — online multiplayer, matchmaking and server-side validation/rating

For Master/Expert, the Minimax engine is intentionally not marketed as true 2800 strength; the difficulty profile is a target configuration. Stockfish integration is the production path.
