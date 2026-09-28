import {chooseMove} from './minimax';
import type {Move,Position} from '../core/types';
import type {AiWorkerResponse} from './ai.worker';
export const DEFAULT_AI_SEARCH_BUDGET_MS=1500;
export const AI_WORKER_TIMEOUT_OVERHEAD_MS=500;
export const AI_WORKER_TIMEOUT_MAX_MS=5000;
export function aiWorkerTimeoutMs(timeBudgetMs=DEFAULT_AI_SEARCH_BUDGET_MS){const budget=Math.max(1,Number.isFinite(timeBudgetMs)?timeBudgetMs:DEFAULT_AI_SEARCH_BUDGET_MS);return Math.min(AI_WORKER_TIMEOUT_MAX_MS,budget+AI_WORKER_TIMEOUT_OVERHEAD_MS)}
async function fallback(position:Position,depth:number,signal?:AbortSignal,timeBudgetMs=DEFAULT_AI_SEARCH_BUDGET_MS){if(signal?.aborted)return undefined;try{const move=chooseMove(position,depth,{signal,timeBudgetMs});return signal?.aborted?undefined:move}catch{return undefined}}
export function requestAiMove(position:Position,depth:number,signal?:AbortSignal,timeBudgetMs=DEFAULT_AI_SEARCH_BUDGET_MS):Promise<Move|undefined>{
 if(typeof Worker==='undefined')return fallback(position,depth,signal,timeBudgetMs);
 const id=++sequence;
 return new Promise(resolve=>{
  let worker:Worker|undefined;let timeoutId:ReturnType<typeof setTimeout>|undefined;let settled=false;
  const cleanup=()=>{if(timeoutId!==undefined)clearTimeout(timeoutId);worker?.terminate();signal?.removeEventListener('abort',abort)};
  const finish=(move?:Move)=>{if(settled)return;settled=true;cleanup();resolve(move)};
  const runFallback=()=>{if(settled)return;worker?.terminate();worker=undefined;fallback(position,depth,signal,timeBudgetMs).then(move=>finish(move),()=>finish(undefined))};
  const abort=()=>{if(settled)return;worker?.postMessage({type:'abort',id});finish(undefined)};
  signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted){abort();return}
  try{
   worker=new Worker(new URL('./ai.worker.ts',import.meta.url),{type:'module'});
   worker.onmessage=(event:MessageEvent<AiWorkerResponse>)=>{if(event.data.id!==id)return;if(event.data.type==='error'){runFallback();return}finish(event.data.move)};
   worker.onerror=runFallback;timeoutId=setTimeout(runFallback,aiWorkerTimeoutMs(timeBudgetMs));
   worker.postMessage({type:'request',id,position,depth,timeBudgetMs});
  }catch{runFallback()}
 })
}
let sequence=0;