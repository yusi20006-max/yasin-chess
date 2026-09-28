import {afterEach,beforeEach,describe,expect,it,vi} from 'vitest';
import {ChessGame} from '../src/core/game';
import {requestAiMove} from '../src/engine/aiWorker';

class StressWorker{
 static instances:StressWorker[]=[];
 onmessage:((event:MessageEvent)=>void)|null=null;
 onerror:(() => void)|null=null;
 terminated=false;
 constructor(){StressWorker.instances.push(this)}
 postMessage(message:{type:string;id:number}){if(message.type==='request')setTimeout(()=>{if(!this.terminated)this.onmessage?.({data:{type:'response',id:message.id,move:{from:12,to:28},depth:1,nodes:1,timedOut:false}} as MessageEvent)},50)}
 terminate(){this.terminated=true}
}
const originalWorker=globalThis.Worker;
beforeEach(()=>{vi.useFakeTimers();StressWorker.instances=[];globalThis.Worker=StressWorker as unknown as typeof Worker});
afterEach(()=>{globalThis.Worker=originalWorker;vi.useRealTimers()});

describe('AI runtime stress lifecycle',()=>{
 it('cancels an in-flight request and terminates its worker',async()=>{
  const controller=new AbortController();
  const promise=requestAiMove(new ChessGame().position,1,controller.signal,100);
  controller.abort();
  await expect(promise).resolves.toBeUndefined();
  expect(StressWorker.instances[0].terminated).toBe(true);
  await vi.advanceTimersByTimeAsync(100);
 });
 it('keeps overlapping request results independently correlated',async()=>{
  const game=new ChessGame();
  const first=requestAiMove(game.position,1,undefined,100);
  const second=requestAiMove(game.position,1,undefined,100);
  await vi.advanceTimersByTimeAsync(50);
  await expect(first).resolves.toEqual({from:12,to:28});
  await expect(second).resolves.toEqual({from:12,to:28});
  expect(StressWorker.instances).toHaveLength(2);
 });
 it('does not allow a timed-out worker response to settle twice',async()=>{
  const promise=requestAiMove(new ChessGame().position,1,undefined,10);
  await vi.advanceTimersByTimeAsync(510);
  await expect(promise).resolves.toBeDefined();
  await vi.advanceTimersByTimeAsync(100);
  await expect(promise).resolves.toBeDefined();
 });
});
