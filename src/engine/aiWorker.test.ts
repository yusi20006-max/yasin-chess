import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {ChessGame} from '../core/game';
import {chooseMove} from './minimax';
import {aiWorkerTimeoutMs,requestAiMove} from './aiWorker';

type WorkerMessage={id:number;position:ChessGame['position'];depth:number;timeBudgetMs?:number};
type WorkerHandler<T>=(event:T)=>void;

class MockWorker {
  static mode:'success'|'silent'|'error'|'late'|'throw'='success';
  static instances:MockWorker[]=[];
  onmessage:WorkerHandler<MessageEvent<{id:number;move?:ReturnType<typeof chooseMove>}>>|null=null;
  onerror:WorkerHandler<ErrorEvent>|null=null;
  terminated=false;
  constructor(){
    if(MockWorker.mode==='throw')throw new Error('worker construction failed');
    MockWorker.instances.push(this);
  }
  postMessage(message:WorkerMessage){
    if(MockWorker.mode==='success'){
      queueMicrotask(()=>{
        if(this.terminated)return;
        this.onmessage?.({data:{id:message.id,move:chooseMove(message.position,message.depth,{timeBudgetMs:message.timeBudgetMs})}} as MessageEvent);
      });
    }else if(MockWorker.mode==='error'){
      queueMicrotask(()=>{if(!this.terminated)this.onerror?.(new ErrorEvent('error'));});
    }else if(MockWorker.mode==='late'){
      setTimeout(()=>{
        this.onmessage?.({data:{id:message.id,move:chooseMove(message.position,1,{timeBudgetMs:message.timeBudgetMs})}} as MessageEvent);
      },100);
    }
  }
  terminate(){this.terminated=true;}
}

const originalWorker=globalThis.Worker;
beforeEach(()=>{
  MockWorker.mode='success';
  MockWorker.instances=[];
  vi.useFakeTimers();
  globalThis.Worker=MockWorker as unknown as typeof Worker;
});
afterEach(()=>{
  globalThis.Worker=originalWorker;
  vi.useRealTimers();
});

describe('requestAiMove',()=>{
  it('returns the Worker move on success',async()=>{
    const game=new ChessGame();
    const promise=requestAiMove(game.position,1,undefined,50);
    await vi.runAllTicks();
    await expect(promise).resolves.toEqual(chooseMove(game.position,1,{timeBudgetMs:50}));
  });

  it('falls back when Worker construction fails',async()=>{
    MockWorker.mode='throw';
    const game=new ChessGame();
    await expect(requestAiMove(game.position,1,undefined,50)).resolves.toEqual(
      chooseMove(game.position,1,{timeBudgetMs:50})
    );
  });

  it('falls back when Worker reports an error',async()=>{
    MockWorker.mode='error';
    const game=new ChessGame();
    await vi.runAllTicks();
    await expect(requestAiMove(game.position,1,undefined,50)).resolves.toEqual(
      chooseMove(game.position,1,{timeBudgetMs:50})
    );
  });

  it('uses an explicit depth-independent runtime budget',()=>{
    expect(aiWorkerTimeoutMs(50)).toBe(550);
    expect(aiWorkerTimeoutMs(1000)).toBe(1500);
    expect(aiWorkerTimeoutMs(6000)).toBe(5000);
  });

  it('falls back when Worker stays silent',async()=>{
    MockWorker.mode='silent';
    const game=new ChessGame();
    const promise=requestAiMove(game.position,1,undefined,10);
    await vi.advanceTimersByTimeAsync(aiWorkerTimeoutMs(10));
    await expect(promise).resolves.toEqual(chooseMove(game.position,1,{timeBudgetMs:10}));
    expect(MockWorker.instances[0].terminated).toBe(true);
  });

  it('settles safely on abort',async()=>{
    MockWorker.mode='silent';
    const game=new ChessGame();
    const controller=new AbortController();
    const promise=requestAiMove(game.position,1,controller.signal,10);
    controller.abort();
    await expect(promise).resolves.toBeUndefined();
    await vi.advanceTimersByTimeAsync(aiWorkerTimeoutMs(10)+100);
  });

  it('ignores a late Worker response after timeout',async()=>{
    MockWorker.mode='late';
    const game=new ChessGame();
    const promise=requestAiMove(game.position,1,undefined,10);
    await vi.advanceTimersByTimeAsync(aiWorkerTimeoutMs(10));
    const fallbackMove=await promise;
    expect(fallbackMove).toEqual(chooseMove(game.position,1,{timeBudgetMs:10}));
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toEqual(fallbackMove);
  });

  it('resolves undefined when fallback has no legal move',async()=>{
    const game=new ChessGame('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1');
    MockWorker.mode='silent';
    const promise=requestAiMove(game.position,1,undefined,10);
    await vi.advanceTimersByTimeAsync(aiWorkerTimeoutMs(10));
    await expect(promise).resolves.toBeUndefined();
  });
});
