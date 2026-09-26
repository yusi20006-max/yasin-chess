import type {Move,Position} from '../core/types';

type Pending={resolve:(move:Move|undefined)=>void;reject:(error:unknown)=>void;worker:Worker};
let sequence=0;

export function requestAiMove(position:Position,depth:number,signal?:AbortSignal):Promise<Move|undefined>{
  if(typeof Worker==='undefined'){
    return Promise.resolve().then(()=>{if(signal?.aborted)return undefined;return undefined});
  }
  const id=++sequence;
  const worker=new Worker(new URL('./ai.worker.ts',import.meta.url),{type:'module'});
  return new Promise<Move|undefined>((resolve,reject)=>{
    const finish=(move?:Move)=>{worker.terminate();signal?.removeEventListener('abort',abort);resolve(move)};
    const fail=(error:unknown)=>{worker.terminate();signal?.removeEventListener('abort',abort);reject(error)};
    const abort=()=>finish(undefined);
    worker.onmessage=(event:MessageEvent<{id:number;move?:Move}>)=>{if(event.data.id===id)finish(event.data.move)};
    worker.onerror=event=>fail(event.error??new Error('AI worker failed'));
    signal?.addEventListener('abort',abort,{once:true});
    if(signal?.aborted){abort();return}
    worker.postMessage({id,position,depth});
  });
}
