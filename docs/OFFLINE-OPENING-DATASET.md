# Offline Opening Dataset

Yasin Chess uses a small, versioned, deterministic opening-line dataset for the Opening Explorer.

- Dataset version: 1.0.0
- Source: original curated move lines authored for Yasin Chess
- Third-party opening database: none
- Runtime network/API dependency: none
- Matching key: normalized SAN move sequence
- Unknown lines fall back to Unknown opening rather than guessing.

The dataset is intentionally compact for PWA/mobile use. It covers common opening families and selected early variations; it is not a replacement for a comprehensive opening database.

The explorer is recalculated directly from the current game history, so live games, imported PGN games, position resets, undo/redo, and new games all use the same deterministic matching path.
