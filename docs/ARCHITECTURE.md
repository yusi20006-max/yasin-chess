# Yasin Chess — Architecture

**Phase 2.0 / Issue #32**

## Layer map

```
┌─────────────────────────────────────────────────────────┐
│  UI          src/ui          React views, board, shell  │
├─────────────────────────────────────────────────────────┤
│  Application src/app         modes, settings, AI glue   │
├─────────────────────────────────────────────────────────┤
│  Engine      src/engine      search, difficulty         │
│  Core        src/core        FIDE rules, board, moves   │
├─────────────────────────────────────────────────────────┤
│  Storage     src/storage     IndexedDB, resume, history │
│  PWA         src/pwa         SW registration, offline   │
│  Platform    src/platform    lifecycle, safe-area, OS   │
└─────────────────────────────────────────────────────────┘
```

## Dependency direction (allowed)

| From → To | core | engine | app | storage | pwa | platform | ui |
|-----------|------|--------|-----|---------|-----|----------|----|
| **core** | — | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **engine** | ✅ | — | ❌ | ❌ | ❌ | ❌ | ❌ |
| **app** | ✅ | ✅ | — | ✅* | ❌ | ❌ | ❌ |
| **storage** | ✅ | ❌ | ❌ | — | ❌ | ❌ | ❌ |
| **pwa** | ❌ | ❌ | ❌ | ❌ | — | ❌ | ❌ |
| **platform** | ❌ | ❌ | ❌ | ❌ | ❌ | — | ❌ |
| **ui** | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | — |

\* Application may call Storage for persistence orchestration; UI must not implement persistence logic itself beyond calling Storage APIs.

## State ownership

| Concern | Owner | Notes |
|---------|-------|-------|
| Board / legal moves / status | **Core** (`ChessGame`) | Pure domain |
| AI search depth / eval | **Engine** | No UI imports |
| Game mode, settings, clock policy | **Application** | Pure functions preferred |
| Active game + history records | **Storage** | IndexedDB only |
| SW cache / offline mode | **PWA** | No chess rules |
| OS lifecycle / safe area | **Platform** | Capacitor-ready |
| Selection, dialogs, layout | **UI** | Ephemeral view state |

## Application shell

`src/ui/AppShell.tsx` is the top-level chrome:

- Brand header + optional sidebar actions
- Locale → `lang` / `dir` on `<html>`
- `main` region for game layout

Entry: `src/main.tsx` registers PWA + platform lifecycle, then mounts `App`.

## Test strategy by layer

| Layer | Strategy |
|-------|----------|
| Core | Unit tests (moves, FEN, draw rules) — no DOM |
| Engine | Unit / depth smoke |
| Storage | fake-indexeddb recovery tests |
| PWA | Manifest/SW static contract tests |
| App | Pure function tests (modes, import/export) |
| UI | Component-level / integration as needed |

## Constraints

1. **Offline-first** — core play must not require network.
2. **Mobile-first UI** — layouts adapt from phone portrait up.
3. **Core rules** change only with regression coverage.
4. **No upward imports** — Core must never import UI/Storage/PWA.

## Related docs

- `docs/PHASE0-CORE-HARDENING-RECONCILIATION.md`
- `docs/PHASE3-PWA-OFFLINE-RECONCILIATION.md`
- `docs/PHASE4-CHESS-BOARD-RECONCILIATION.md`
- `docs/PHASE5-GAME-EXPERIENCE-RECONCILIATION.md`
- `docs/PHASE6-PERSISTENCE-RECONCILIATION.md`
