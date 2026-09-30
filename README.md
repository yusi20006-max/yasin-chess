# Yasin Chess

Professional, modular chess application for Persian/English users.

**Current status (2026-09-30):** Phase 0 (core rule hardening) and Phase 1 foundation are **complete**. The product line is at **v0.3.0** with substantial Phase 2+ work already landed (PWA, offline, persistence, Android, clocks, analysis scaffolding, themes, etc.). Remaining open work is tracked in the Phase 2+ issues and open PRs.

## Stack
- React + TypeScript + Vite
- Pure TypeScript chess rules engine (no UI dependency)
- Vitest tests
- Capacitor (Android)
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
0. **Phase 0 — Core hardening** ✅ DONE (castling, FEN integrity, draw rules, EP, PGN results, engine perspective baseline). See `docs/PHASE0-CORE-HARDENING-RECONCILIATION.md`.
1. **Phase 1 — Core + difficulty** ✅ DONE (FIDE-oriented rules, SAN/PGN/FEN, undo/redo, legal moves, Minimax/Alpha-Beta).
2. **Phase 2 — Offline-first + Professional UI** (in progress — many sub-issues open; see #31 and related).
3. Phase 3+ — Analysis, puzzles, coaching, online multiplayer, etc. (scaffolding already present).

For Master/Expert, the Minimax engine is intentionally not marketed as true 2800 strength; the difficulty profile is a target configuration. Stockfish integration is the production path.

## Key docs
- `docs/PHASE0-CORE-HARDENING-RECONCILIATION.md`
- `docs/PHASE2-FINAL-AUDIT-RECONCILIATION.md`
- Android / PWA / security / release checklists under `docs/`
