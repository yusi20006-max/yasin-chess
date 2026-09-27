import {chooseMove} from './minimax';
import type {Move,Position} from '../core/types';

export const AI_WORKER_TIMEOUT_BASE_MS=800;
export const AI_WORKER_TIMEOUT_PER_DEPTH_MS=350;
export const AI_WORKER_TIMEOUT_MAX_MS=5000;

export function aiWorkerTimeoutMs(depth:number){
  const normalized=Math.max(1,Number.isFinite(depth)?depth:1);
  return Math.min(
    AI_WORKER_TIMEOUT_MAX_MS,
    AI_WORKER_TIMEOUT_BASE_MS+normalized*AI_WORKER_TIMEOUT_PER_DEPTH_MS
  );
}

async function fallback(
  position:Position,
  depth:number,
  signal?:AbortSignal
):Promise<Move|undefined>{
  if(signal?.aborted)return undefined;
  try{
    const move=chooseMove(position,depth);
    return signal?.aborted?undefined:move;
  }catch{
    return undefined;
  }
}

export function requestAiMove(
  position:Position,
  depth:number,
  signal?:AbortSignal
):Promise<Move|undefined>{
  if(typeof Worker==='undefined')return fallback(position,depth,signal);

  const id=++sequence;

  return new Promise<Move|undefined>(resolve=>{
    let worker:Worker|undefined;
    let timeoutId:ReturnType<typeof setTimeout>|undefined;
    let settled=false;

    const cleanup=()=>{
      if(timeoutId!==undefined)clearTimeout(timeoutId);
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
      worker?.terminate();
      worker=undefined;
      fallback(position,depth,signal).then(
        move=>finish(move),
        ()=>finish(undefined)
      );
    };

    const abort=()=>finish(undefined);

    signal?.addEventListener('abort',abort,{once:true});

    if(signal?.aborted){
      abort();
      return;
    }

    try{
      worker=new Worker(
        new URL('./ai.worker.ts',import.meta.url),
        {type:'module'}
      );

      worker.onmessage=(event:MessageEvent<{id:number;move?:Move}>)=>{
        if(event.data.id===id)finish(event.data.move);
      };

      worker.onerror=runFallback;

      timeoutId=setTimeout(
        runFallback,
        aiWorkerTimeoutMs(depth)
      );

      worker.postMessage({
        id,
        position,
        depth
      });
    }catch{
      runFallback();
    }
  });
}

let sequence=0;
