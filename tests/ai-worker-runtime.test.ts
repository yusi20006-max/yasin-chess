import {afterEach,describe,expect,it,vi} from 'vitest';
import {ChessGame} from '../src/core/game';
import {requestAiMove} from '../src/engine/aiWorker';

describe('AI worker runtime resilience',()=>{
  afterEach(()=>{
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('falls back when a Worker stalls without a response',async()=>{
    vi.useFakeTimers();
    class StalledWorker{
      onmessage:((event:MessageEvent)=>void)|null=null;
      onerror:(()=>void)|null=null;
      onmessageerror:(()=>void)|null=null;
      postMessage(){/* intentionally stalled */}
      terminate(){/* noop */}
    }
    vi.stubGlobal('Worker',StalledWorker);

    const game=new ChessGame();
    const whiteMove=game.legalMoves()[0];
    game.play(whiteMove);

    const pending=requestAiMove(game.position,2);
    await vi.advanceTimersByTimeAsync(3000);
    await expect(pending).resolves.toBeDefined();
  });

  it('returns undefined when aborted before fallback',async()=>{
    const controller=new AbortController();
    controller.abort();
    await expect(requestAiMove(new ChessGame().position,2,controller.signal)).resolves.toBeUndefined();
  });
});
