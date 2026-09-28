import {ChessGame} from '../core/game';
import type {GameMode} from './modes';

/**
 * Undo one step for Human-vs-AI: remove the latest complete White+Black turn
 * pair so control returns to the human (White) decision point. If only a
 * White move exists (the AI has not replied yet) remove that single ply.
 *
 * Returns the number of plies removed, or 0 when there was nothing to undo.
 * In every other mode this is a plain single-ply undo, preserving the
 * existing Human-vs-Human semantics.
 */
export function undoTurnPair(game: ChessGame, mode: GameMode): number {
  let removed = 0;
  if (!game.undo()) return 0;
  removed = 1;
  if (mode === 'human-vs-ai' && game.position.turn === 'b' && game.undo()) removed = 2;
  return removed;
}

/**
 * Redo one step for Human-vs-AI: restore the complete White+Black turn pair
 * that a paired undo removed, so a single Redo never lands on an intermediate
 * Black-to-move position (where the AI effect would re-fire and destroy the
 * remaining Redo chain via play()).
 *
 * Returns the number of plies restored, or 0 when there was nothing to redo.
 * In every other mode this is a plain single-ply redo.
 */
export function redoTurnPair(game: ChessGame, mode: GameMode): number {
  let restored = 0;
  if (!game.redo()) return 0;
  restored = 1;
  if (mode === 'human-vs-ai' && game.position.turn === 'b' && game.redo()) restored = 2;
  return restored;
}
