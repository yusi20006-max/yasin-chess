# Stockfish strength mapping (#410)

Difficulty presets map to Stockfish **Skill Level** (0–20) via `difficulty.stockfishSkill`:

| Difficulty   | Minimax depth | Stockfish Skill | Notes |
|--------------|---------------|-----------------|-------|
| beginner     | 2             | 2               | Soft play |
| intermediate | 4             | 7               | Club level |
| advanced     | 8             | 14              | Strong |
| master       | 14            | 20              | Full strength (lite engine still capped by WASM build) |
| custom       | user depth    | 10              | Skill fixed unless extended later |

- Stockfish search depth is `min(16, difficulty.depth)` to limit mobile latency.
- Engine binary: **stockfish-19-lite-single** (~1.8MB WASM), lazy-loaded from `/engines/`.
- If WASM/Worker fails, registry **falls back to Minimax** automatically.
- Minimax remains the default and is never removed.
