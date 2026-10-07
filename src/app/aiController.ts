import {legalMoves} from '../core/moves';
import type {Move, Position} from '../core/types';
import {requestAiMove} from '../engine/aiWorker';
import type {EngineId} from '../engine/engineId';
import {DEFAULT_ENGINE_ID} from '../engine/engineId';

function sameMove(a: Move, b: Move): boolean {
  return a.from === b.from && a.to === b.to && a.promotion === b.promotion;
}

function isLegalMove(position: Position, move: Move | undefined): move is Move {
  if (!move) return false;
  return legalMoves(position).some((candidate) => sameMove(candidate, move));
}

export type AiControllerRequest = {
  position: Position;
  depth: number;
  signal?: AbortSignal;
  engineId?: EngineId;
  skillLevel?: number;
};

export async function requestAiTurn({
  position,
  depth,
  signal,
  engineId = DEFAULT_ENGINE_ID,
  skillLevel,
}: AiControllerRequest): Promise<Move | undefined> {
  if (signal?.aborted) return undefined;
  const move = await requestAiMove(position, depth, signal, undefined, engineId, skillLevel);
  if (signal?.aborted) return undefined;
  return isLegalMove(position, move) ? move : undefined;
}
