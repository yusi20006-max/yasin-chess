# Phase 6 — Persistence & Recovery Reconciliation

**Date:** 2026-09-30  
**Scope:** Active game resume, crash recovery, local history, schema versioning

## Summary

Phase 6 (Persistence & Recovery) is **complete** on the current main line.

## Component map

| Capability | Module | Status |
|------------|--------|--------|
| IndexedDB CRUD | `src/storage/db.ts` | Done |
| Schema version + migrate | `src/storage/migrations.ts` (`CURRENT_SCHEMA_VERSION = 3`) | Done |
| Active game save / clear | `src/storage/activeGame.ts` | Done |
| Resume active game | `resumeActiveGame()` | Done |
| Primary + backup recovery | `src/storage/recovery.ts` | Done |
| Corrupt-record safe fallback | `isRecoverableGame` + `selectRecoverySnapshot` | Done |
| Local game history | `src/storage/history.ts` (`saveGameToHistory`, metadata list) | Done |
| Search / recent | `src/storage/gameSearch.ts` | Done |
| Persist helper | `src/storage/gamePersistence.ts` | Done |

## Issue close-out

| Issue / PR | Title | Resolution |
|------------|-------|------------|
| #59 | Resume Active Game | Satisfied by `resumeActiveGame()` + primary/backup + migrate |
| #60 | Local Game History | Satisfied by `saveGameToHistory` + list items (date, mode, result, moveCount, stable id) |
| PR #58 | Crash & Reload Recovery tests | Tests cover newest snapshot, backup fallback, both-invalid; merge or keep as regression |
| PR #355 | IndexedDB schema versioning | Aligns with existing `CURRENT_SCHEMA_VERSION` + migrate; merge preferred |

## Acceptance criteria check

### #59 Resume Active Game
- [x] User can resume unfinished local game via `resumeActiveGame()`
- [x] Position, history, future, keys restored
- [x] Corrupted primary falls back to backup
- [x] Both invalid → undefined (no crash)

### #60 Local Game History
- [x] Stable identifiers (`game:<time>:<rand>`)
- [x] Date (`updatedAt` / `createdAt`)
- [x] Mode / difficulty metadata
- [x] Result token
- [x] Move count
- [x] List + search + remove APIs

## Constraints
- Offline-first: IndexedDB only, no network dependency
- Core rules unchanged
- Storage isolated from UI

## Definition of Done
- [x] Code on main covers resume + history + recovery
- [x] History metadata API complete
- [x] Reconciliation document committed
- [x] Issues #59 and #60 closed
