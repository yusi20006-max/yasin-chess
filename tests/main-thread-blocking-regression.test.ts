import {describe,expect,it,vi} from 'vitest';
import {requestAiMove} from '../src/engine/aiWorker';

class RecordingWorker {
  static instances:RecordingWorker[]=[];
  onmessage:((event:MessageEvent<{id:number;move?:{from:number;to:number}}>)=>void)|null=null;
  onerror:(()=>void)|null=null;
  onmessageerror:(()=>void)|null=null;
  terminated=false;

  constructor(){
    RecordingWorker.instances.push(this);
  }

  postMessage(data:{type:string;id:number}){
    if(data.type!=='request') return;
    queueMicrotask(()=>{
      this.onmessage?.({data:{id:data.id,move:{from:12,to:28}}} as MessageEvent);
    });
  }

  terminate(){
    this.terminated=true;
  }
}

describe('main-thread AI blocking regression',()=>{
  it('routes a normal AI request through Worker execution',async()=>{
    vi.stubGlobal('Worker',RecordingWorker);
    RecordingWorker.instances=[];

    const position={
      board:[],
      turn:'w',
      castling:{wK:true,wQ:true,bK:true,bQ:true},
      enPassant:null,
      halfmove:0,
      fullmove:1,
    };

    const move=await requestAiMove(position as never,1);

    expect(move).toEqual({from:12,to:28});
    expect(RecordingWorker.instances).toHaveLength(1);
    expect(RecordingWorker.instances[0].terminated).toBe(true);

    vi.unstubAllGlobals();
  });
});
