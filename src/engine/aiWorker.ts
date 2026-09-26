import {chooseMove} from './minimax';
import type {Move,Position} from '../core/types';

type Pending={resolve:(move:Move|undefined)=>void;reject:(error:unknown)=>void;worker:Worker};
let sequence=0;

function fallback(position:Position,depth:number,signal?:AbortSignal){
  return Promise.resolve().then(()=>signal?.aborted?undefined:chooseMove(position,depth));
}

export function requestAiMove(position:Position,depth:number,signal?:AbortSignal):Promise<Move|undefined>{
  if(typeof Worker==='undefined')return fallback(position,depth,signal);
  const id=++sequence;
  return new Promise<Move|undefined>(resolve=>{
    let worker:Worker|undefined;
    let settled=false;
    const cleanup=()=>{
      worker?.terminate();
      signal?.removeEventListener('abort',abort);
    };
    const finish=(move?:Move)=>{if(settled)return;settled=true;cleanup();resolve(move)};
    const abort=()=>finish(undefined);
    signal?.addEventListener('abort',abort,{once:true});
    if(signal?.aborted){abort();return}
    try{
      worker=new Worker(new URL('./ai.worker.ts',import.meta.url),{type:'module'});
      worker.onmessage=(event:MessageEvent<{id:number;move?:Move}>)=>{if(event.data.id===id)finish(event.data.move)};
      worker.onerror=()=>{cleanup();if(settled)return;settled=true;fallback(position,depth,signal).then(resolve)};
      worker.postMessage({id,position,depth});
    }catch{
      cleanup();
      fallback(position,depth,signal).then(resolve);
    }
  });
}
