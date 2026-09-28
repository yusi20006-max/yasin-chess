import {describe,expect,it,vi} from 'vitest';
import type {Move} from '../src/core/types';
import {requestAiMove} from '../src/engine/aiWorker';

class FakeWorker {
  static instances:FakeWorker[]=[];
  onmessage:((event:MessageEvent<{id:number;move?:Move}>)=>void)|null=null;
  onerror:(() => void)|null=null;
  terminated=false;
  constructor(){FakeWorker.instances.push(this)}
  postMessage(data:{id:number}){queueMicrotask(()=>{
    this.onmessage?.({data:{id:data.id,move:{from:12,to:28}}} as MessageEvent);
  })}
  terminate(){this.terminated=true}
}

describe('AI worker runtime regression',()=>{
  it('uses Worker execution when Worker is available',async()=>{
    vi.stubGlobal('Worker',FakeWorker);
    FakeWorker.instances=[];
    const move=await requestAiMove({board:[],turn:'w',castling:{wK:true,wQ:true,bK:true,bQ:true},enPassant:null,halfmove:0,fullmove:1} as never,1);
    expect(move).toEqual({from:12,to:28});
    expect(FakeWorker.instances).toHaveLength(1);
    expect(FakeWorker.instances[0].terminated).toBe(true);
    vi.unstubAllGlobals();
  });

  it('falls back when Worker construction fails',async()=>{
    const fallback={from:12,to:28};
    vi.stubGlobal('Worker',class {constructor(){throw new Error('worker unavailable')}});
    const minimax=await import('../src/engine/minimax');
    const spy=vi.spyOn(minimax,'chooseMove').mockReturnValue(fallback);
    const move=await requestAiMove({board:[],turn:'w',castling:{wK:true,wQ:true,bK:true,bQ:true},enPassant:null,halfmove:0,fullmove:1} as never,1);
    expect(move).toEqual(fallback);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
    vi.unstubAllGlobals();
  });
});
