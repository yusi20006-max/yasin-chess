import type {Move, Position} from '../core/types';
import type {AiWorkerResponse} from './ai.worker';
import type {EngineId} from './engineId';
import {DEFAULT_ENGINE_ID} from './engineId';
import {requestEngineMove} from './registry';

export const DEFAULT_AI_SEARCH_BUDGET_MS = 1500;
export const AI_WORKER_TIMEOUT_OVERHEAD_MS = 500;
export const AI_WORKER_TIMEOUT_MAX_MS = 5000;

export function aiWorkerTimeoutMs(timeBudgetMs = DEFAULT_AI_SEARCH_BUDGET_MS) {
  const budget = Math.max(1, Number.isFinite(timeBudgetMs) ? timeBudgetMs : DEFAULT_AI_SEARCH_BUDGET_MS);
  return Math.min(AI_WORKER_TIMEOUT_MAX_MS, budget + AI_WORKER_TIMEOUT_OVERHEAD_MS);
}

async function runViaRegistry(
  position: Position,
  depth: number,
  signal: AbortSignal | undefined,
  timeBudgetMs: number,
  engineId: EngineId,
  skillLevel?: number,
): Promise<Move | undefined> {
  if (signal?.aborted) return undefined;
  const result = await requestEngineMove(engineId, position, {
    depth,
    skillLevel,
    timeBudgetMs,
    signal,
  });
  return signal?.aborted ? undefined : result.move;
}

/**
 * Request AI move. Minimax still uses the dedicated worker path for parallelism;
 * Stockfish (and fallback) go through the engine registry.
 */
export function requestAiMove(
  position: Position,
  depth: number,
  signal?: AbortSignal,
  timeBudgetMs = DEFAULT_AI_SEARCH_BUDGET_MS,
  engineId: EngineId = DEFAULT_ENGINE_ID,
  skillLevel?: number,
): Promise<Move | undefined> {
  if (engineId === 'stockfish-wasm') {
    return runViaRegistry(position, depth, signal, timeBudgetMs, engineId, skillLevel);
  }

  if (typeof Worker === 'undefined') {
    return runViaRegistry(position, depth, signal, timeBudgetMs, 'minimax', skillLevel);
  }

  const id = ++sequence;
  return new Promise((resolve) => {
    let worker: Worker | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let settled = false;
    const cleanup = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      worker?.terminate();
      signal?.removeEventListener('abort', abort);
    };
    const finish = (move?: Move) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(move);
    };
    const runFallback = () => {
      if (settled) return;
      worker?.terminate();
      worker = undefined;
      runViaRegistry(position, depth, signal, timeBudgetMs, 'minimax', skillLevel).then(
        (move) => finish(move),
        () => finish(undefined),
      );
    };
    const abort = () => {
      if (settled) return;
      worker?.postMessage({type: 'abort', id});
      finish(undefined);
    };
    signal?.addEventListener('abort', abort, {once: true});
    if (signal?.aborted) {
      abort();
      return;
    }
    try {
      worker = new Worker(new URL('./ai.worker.ts', import.meta.url), {type: 'module'});
      worker.onmessage = (event: MessageEvent<AiWorkerResponse>) => {
        if (event.data.id !== id) return;
        if (event.data.type === 'error') {
          runFallback();
          return;
        }
        finish(event.data.move);
      };
      worker.onerror = runFallback;
      timeoutId = setTimeout(runFallback, aiWorkerTimeoutMs(timeBudgetMs));
      worker.postMessage({type: 'request', id, position, depth, timeBudgetMs});
    } catch {
      runFallback();
    }
  });
}

let sequence = 0;
