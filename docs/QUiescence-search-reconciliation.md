# Quiescence Search Reconciliation

Issue #79 is satisfied by the current search implementation.

- `src/engine/minimax.ts` contains a bounded capture/check-focused quiescence search.
- The extension depth is explicitly capped.
- `tests/quiescence-search.test.ts` provides regression coverage.
- Search remains time-budgeted and cancellation-aware through the shared search context.

This is a historical Phase 2 issue; the implementation is retained and exercised by the current engine test suite.
