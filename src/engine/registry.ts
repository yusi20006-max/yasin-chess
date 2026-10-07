import type {Move, Position} from '../core/types';
import type {ChessEngine, EngineMoveResult, EngineSearchOptions} from './adapter';
import {createMinimaxAdapter} from './adapters/minimaxAdapter';
import {createStockfishAdapter} from './adapters/stockfishAdapter';
import type {EngineId} from './engineId';
import {DEFAULT_ENGINE_ID, isEngineId} from './engineId';

const minimax = createMinimaxAdapter();
let stockfish: ChessEngine | null = null;

function getStockfish(): ChessEngine {
  if (!stockfish) stockfish = createStockfishAdapter();
  return stockfish;
}

export function getEngine(id: EngineId): ChessEngine {
  if (id === 'stockfish-wasm') return getStockfish();
  return minimax;
}

export function resolveEngineId(value: unknown): EngineId {
  return isEngineId(value) ? value : DEFAULT_ENGINE_ID;
}

/**
 * Request a move from the selected engine with automatic Minimax fallback.
 */
export async function requestEngineMove(
  engineId: EngineId,
  position: Position,
  options: EngineSearchOptions,
): Promise<EngineMoveResult> {
  const preferred = getEngine(engineId);
  if (engineId === 'minimax') {
    const move = await preferred.chooseMove(position, options);
    return {move, engineId: 'minimax', fellBack: false};
  }

  try {
    if (preferred.init) await preferred.init();
    if (options.signal?.aborted) return {move: undefined, engineId: 'stockfish-wasm', fellBack: false};
    const move = await preferred.chooseMove(position, options);
    if (move) return {move, engineId: 'stockfish-wasm', fellBack: false};
  } catch {
    /* fall through */
  }

  const move = await minimax.chooseMove(position, options);
  return {move, engineId: 'minimax', fellBack: true};
}

/** Test helper: inject/replace stockfish instance. */
export function __setStockfishForTests(engine: ChessEngine | null) {
  stockfish = engine;
}

export function __getMinimaxForTests(): ChessEngine {
  return minimax;
}
