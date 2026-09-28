import {afterEach,describe,expect,it,vi} from 'vitest';
import {ChessGame} from '../src/core/game';
import {legalMoves} from '../src/core/moves';
import {requestAiTurn} from '../src/app/aiController';

class ControllerWorker {
  static instances:ControllerWorker[]=[];
  onmessage:((event:MessageEvent<{id:number;move?:unknown}>)=>void)|null=null;
  onerror:(()=>void)|null=null;
  terminated=false;

  constructor(){
    ControllerWorker.instances.push(this);
  }

  postMessage(data:{type:string;id:number;position?:unknown}){
    if(data.type!=='request'||!data.position)return;
    const moves=legalMoves(data.position as never);
    queueMicrotask(()=>{
      this.onmessage?.({data:{type:'response',id:data.id,move:moves[0]}} as MessageEvent);
    });
  }

  terminate(){
    this.terminated=true;
  }
}

afterEach(()=>{
  vi.unstubAllGlobals();
});

describe('Worker-first AI controller contract',()=>{
  it('keeps UI requests behind the Worker boundary and validates the returned move',async()=>{
    vi.stubGlobal('Worker',ControllerWorker);
    ControllerWorker.instances=[];

    const game=new ChessGame();
    game.play(legalMoves(game.position)[0]);

    const move=await requestAiTurn({position:game.position,depth:1});

    expect(move).toEqual(legalMoves(game.position)[0]);
    expect(ControllerWorker.instances).toHaveLength(1);
    expect(ControllerWorker.instances[0].terminated).toBe(true);
  });

  it('does not execute a request after cancellation',async()=>{
    vi.stubGlobal('Worker',ControllerWorker);
    ControllerWorker.instances=[];

    const controller=new AbortController();
    controller.abort();

    await expect(
      requestAiTurn({position:new ChessGame().position,depth:2,signal:controller.signal})
    ).resolves.toBeUndefined();

    expect(ControllerWorker.instances).toHaveLength(0);
  });
});
