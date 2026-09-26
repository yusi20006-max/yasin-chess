import { describe, expect, it } from 'vitest';
import { runtimeKind, isStandaloneRuntime } from '../src/platform/runtime';
import { isHumanTurn } from '../src/app/modes';
import { ChessGame } from '../src/core/game';
import { requestAiMove } from '../src/engine/aiWorker';

describe('runtime detection', () => {
  it('returns a supported runtime kind', () => {
    expect(['web', 'android', 'ios']).toContain(runtimeKind());
  });

describe('human-vs-ai runtime guards', () => {
  it('allows human input only on white turn', () => {
    expect(isHumanTurn('human-vs-ai', 'w')).toBe(true);
    expect(isHumanTurn('human-vs-ai', 'b')).toBe(false);
  });

  it('falls back when browser Worker construction fails', async () => {
    const originalWorker = globalThis.Worker;
    class BrokenWorker {
      constructor() { throw new Error('worker unavailable'); }
    }
    globalThis.Worker = BrokenWorker as unknown as typeof Worker;
    try {
      const move = await requestAiMove(new ChessGame().position, 1);
      expect(move).toBeDefined();
    } finally {
      globalThis.Worker = originalWorker;
    }
  });
});
  it('does not claim standalone web runtime', () => {
    if (runtimeKind() === 'web') expect(isStandaloneRuntime()).toBe(false);
  });
});
