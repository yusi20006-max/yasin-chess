import type {Move, Position} from '../core/types';
import type {EngineId} from './engineId';

export type EngineSearchOptions = {
  depth: number;
  /** Stockfish Skill Level 0\u201320 when supported. */
  skillLevel?: number;
  timeBudgetMs?: number;
  signal?: AbortSignal;
};

export type EngineMoveResult = {
  move?: Move;
  engineId: EngineId;
  /** True when the requested engine failed and Minimax answered instead. */
  fellBack: boolean;
};

/**
 * Clean engine adapter contract \u2014 UI/orchestration stay independent of implementation.
 */
export type ChessEngine = {
  readonly id: EngineId;
  /** Optional one-time init (lazy WASM load, UCI handshake). */
  init?: () => Promise<void>;
  chooseMove: (position: Position, options: EngineSearchOptions) => Promise<Move | undefined>;
  dispose?: () => void;
};
