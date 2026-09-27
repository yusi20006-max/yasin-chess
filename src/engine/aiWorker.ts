import {chooseMove} from './minimax';
import type {Move,Position} from '../core/types';

const WORKER_TIMEOUT_MS=1500;
let sequence=0;

function fallback(position:Position,depth:number,signal?:AbortSignal):Promise<Move|undefined>{
  return Promise.resolve().then(()=>signal?.aborted?undefined:chooseMove(position,depth));
}

export function requestAiMove(position:Position,depth:number,signal?:AbortSignal):Promise<Move|undefined>{
  if(typeof Worker==='undefined')return fallback(position,depth,signal);

  const id=++sequence;
  return new Promise<Move|undefined>(resolve=>{
    let worker:Worker|undefined;
    let settled=false;
    let timeout:ReturnType<typeof setTimeout>|undefined;

    const cleanup=()=>{
      if(timeout!==undefined)clearTimeout(timeout);
      worker?.terminate();
      signal?.removeEventListener('abort',abort);
    };

    const finish=(move?:Move)=>{
      if(settled)return;
      settled=true;
      cleanup();
      resolve(move);
    };

    const runFallback=()=>{
      if(settled)return;
      settled=true;
      cleanup();
      fallback(position,depth,signal)
        .then(resolve)
        .catch(()=>resolve(undefined));
    };

    const abort=()=>finish(undefined);
    signal?.addEventListener('abort',abort,{once:true});

    if(signal?.aborted){
      abort();
      return;
    }

    try{
      worker=new Worker(new URL('./ai.worker.ts',import.meta.url),{type:'module'});
      worker.onmessage=(event:MessageEvent<{id:number;move?:Move}>)=>{
        if(event.data.id===id)finish(event.data.move);
      };
      worker.onerror=runFallback;
      worker.postMessage({id,position,depth});
      timeout=setTimeout(runFallback,WORKER_TIMEOUT_MS);
    }catch{
      runFallback();
    }
  });
}
