# Engine Selection — Issue #410

Yasin Chess keeps the existing local Minimax engine and adds Stockfish.js 19 Lite Single-Threaded as an optional offline engine.

## Engines

- **Local Minimax** — existing engine; remains the default and fallback path.
- **Stockfish WASM** — Stockfish.js 19.0.0 lite single-threaded build, loaded only when selected.

The lite single-threaded build is used deliberately for mobile/PWA constraints. It avoids SharedArrayBuffer/cross-origin-isolation requirements and keeps the distributed WASM payload much smaller than the full multi-threaded build. The engine runs locally through UCI in a Web Worker; no runtime network request is required.

## Strength mapping

The existing Yasin difficulty levels are retained. For Stockfish, the same difficulty controls search depth and maps to Stockfish's UCI Skill Level:

- Beginner → skill 2
- Intermediate → skill 7
- Advanced → skill 14
- Master → skill 20
- Custom → skill 10

Stockfish is substantially stronger than Minimax even at lower settings, so these values are a practical strength mapping rather than an Elo-equivalence claim.

## Fallback

If Stockfish cannot initialize, times out, crashes, or otherwise fails to produce a move, requestAiTurn retries through the existing Minimax worker path. The selected preference remains Stockfish so a later move can retry initialization.

## Offline distribution and license

Stockfish assets are copied from the pinned npm dependency during predev, pretest, and prebuild into public/engine/. The distributed files are:

- stockfish-19-lite-single.js
- stockfish-19-lite-single.wasm
- stockfish-COPYING.txt
- manifest.json

Stockfish.js is GPL-3.0. The source project is https://github.com/nmrugg/stockfish.js and the pinned npm package is stockfish@19.0.0.

## Architecture

UI/settings → src/app/aiController.ts → src/engine/adapter.ts → Minimax or Stockfish adapter.

The UI does not depend on UCI details, and the Stockfish worker is created lazily only when that engine is selected.
