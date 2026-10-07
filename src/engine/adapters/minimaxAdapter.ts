import type {Move, Position} from '../../core/types';
import type {ChessEngine, EngineSearchOptions} from '../adapter';
import {chooseMove} from '../minimax';

export function createMinimaxAdapter(): ChessEngine {
  return {
    id: 'minimax',
    async chooseMove(position: Position, options: EngineSearchOptions): Promise<Move | undefined> {
      if (options.signal?.aborted) return undefined;
      try {
        return chooseMove(position, options.depth, {
          signal: options.signal,
          timeBudgetMs: options.timeBudgetMs,
        });
      } catch {
        return undefined;
      }
    },
  };
}
