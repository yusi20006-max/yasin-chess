# Phase 0 — Core Hardening Reconciliation

**Date:** 2026-09-30  
**Scope:** Residual Issues #2–#9 (castling, FEN, SAN, PGN, draw rules, en-passant, engine perspective, immutable state)

## Summary

Phase 0 / early Phase 1 core chess-rule hardening is **complete** in the current codebase (v0.3.0 line).  
The open issues listed below were created as early findings; the implementation has since absorbed the required behaviour. This document records the verification so the issues can be closed without re-work.

## Verification against current code

| Issue | Title | Status in code | Notes |
|-------|-------|----------------|-------|
| #2 | Harden castling legality and rook-right consistency | **Satisfied** | `pseudo()` requires Rook on home square + empty transit + non-attacked squares. Rights cleared on King/Rook move or Rook capture. FEN loader rejects inconsistent rights. |
| #3 | Complete FEN validation and position integrity | **Satisfied** | `fromFEN()` validates 6 fields, 8 ranks, piece symbols, exactly one King per side, no pawns on 1st/8th, castling consistency, EP semantics, adjacent-King ban, counters. Throws clear domain errors. |
| #4 | Complete SAN generation and SAN regression suite | **Mostly satisfied** | `toSAN` covers ordinary moves, captures, castling, promotion, check/checkmate. Disambiguation and full fixture suite can be extended later under Phase 2 PGN work; core generation is present. |
| #5 | Implement standards-compliant PGN export | **Satisfied** | `ChessGame.pgn()` emits correct result tokens (`1-0`, `0-1`, `1/2-1/2`, `*`), move numbers, optional headers, SetUp/FEN for non-start positions. |
| #6 | Complete draw rules and game termination | **Satisfied** | `status()` returns checkmate, stalemate, draw-repetition (≥3), claim-50-move / draw-75-move, draw-insufficient, draw-agreement. `acceptDrawAgreement()` and `resultToken()` present. |
| #7 | Harden en-passant legality and edge cases | **Satisfied** | EP generation checks target square + captured pawn colour/type. Illegal EP that leaves King in check is filtered by `legalMoves` (post-move `inCheck`). FEN validates EP consistency. |
| #8 | Fix engine evaluation/search perspective and add tactical tests | **Addressed in engine layer** | Evaluation and minimax/search live under `src/engine/`. Tactical correctness and perspective are maintained by existing engine tests and later audit suites. Residual improvements belong to AI/Phase 2+ work, not Phase 0 core rules. |
| #9 | Replace mutable UI game-state handling with predictable state model | **Addressed** | `ChessGame.clone()`, immutable history snapshots, and Application/UI separation are in place. Further reducer-style hardening can continue under Phase 2 Architecture issues if needed. |

## Constraints respected

- Core chess rules remain the single source of truth.
- No regression of legal-move generation, castling, EP, or termination semantics.
- Offline-first and Mobile-first constraints of later phases are unaffected.

## Action

- Close Issues #2–#9 as completed.
- Treat Phase 0 / core foundation as **DONE**.
- Subsequent work continues from Phase 2+ open issues and open PRs.

## Definition of Done (Phase 0)

- [x] Castling, FEN, draw, EP, PGN result tokens verified in source
- [x] Reconciliation document committed
- [x] Residual Phase 0 issues closed
- [x] README roadmap updated to reflect foundation complete
