import {toFEN} from '../core/board';
import type {Move,Position} from '../core/types';

const ENGINE_PATH='engine/stockfish-19-lite-single.js';
const INIT_TIMEOUT_MS=8000;
const SEARCH_TIMEOUT_MS=8000;

let worker:Worker|undefined;
let ready:Promise<void>|undefined;
let busy=false;

function ensureWorker():Promise<void>{
 if(typeof Worker==='undefined')return Promise.reject(new Error('Web Workers are unavailable'));
 if(ready)return ready;
 ready=new Promise<void>((resolve,reject)=>{
  const w=new Worker(new URL(ENGINE_PATH,document.baseURI),{type:'classic'});
  worker=w;
  let timer:ReturnType<typeof setTimeout>|undefined;
  const fail=(error:Error)=>{if(timer)clearTimeout(timer);w.terminate();worker=undefined;ready=undefined;reject(error)};
  timer=setTimeout(()=>fail(new Error('Stockfish initialization timed out')),INIT_TIMEOUT_MS);
  w.onmessage=(event:MessageEvent)=>{const line=String(event.data??'');if(line==='uciok'){clearTimeout(timer);w.onmessage=null;resolve()}};
  w.onerror=()=>fail(new Error('Stockfish worker failed to initialize'));
  w.postMessage('uci');
 });
 return ready;
}

function parseMove(uci:string,position:Position):Move|undefined{
 const m=uci.trim().match(/^([a-h][1-8])([a-h][1-8])([qrbn])?$/i);
 if(!m)return undefined;
 const file=(s:string)=>s.charCodeAt(0)-97;
 const square=(s:string)=>file(s)+(Number(s[1])-1)*8;
 const from=square(m[1].toLowerCase()),to=square(m[2].toLowerCase());
 const promotion=m[3]?.toLowerCase() as Move['promotion']|undefined;
 const legal=position.board[from]?.color===position.turn;
 if(!legal)return undefined;
 return promotion?{from,to,promotion}:{from,to};
}

export async function requestStockfishMove(position:Position,depth:number,skill:number,signal?:AbortSignal):Promise<Move|undefined>{
 if(signal?.aborted)return undefined;
 if(busy)throw new Error('Stockfish engine is busy');
 busy=true;
 try{
  await ensureWorker();
  const currentWorker=worker;
  if(!currentWorker)throw new Error('Stockfish worker unavailable');
  return await new Promise<Move|undefined>((resolve,reject)=>{
   let timer:ReturnType<typeof setTimeout>|undefined;
   let settled=false;
   const finish=(move?:Move,error?:Error)=>{
    if(settled)return;
    settled=true;
    if(timer)clearTimeout(timer);
    signal?.removeEventListener('abort',abort);
    if(error)reject(error);else resolve(move);
   };
   const abort=()=>{
    try{currentWorker.postMessage('stop')}catch{}
    finish(undefined);
   };
   signal?.addEventListener('abort',abort,{once:true});
   if(signal?.aborted){abort();return}
   currentWorker.onmessage=(event:MessageEvent)=>{
    const line=String(event.data??'');
    if(line.startsWith('bestmove ')){
     finish(parseMove(line.slice(9).split(/\s+/)[0],position));
    }
   };
   currentWorker.onerror=()=>finish(undefined,new Error('Stockfish worker failed during search'));
   timer=setTimeout(()=>finish(undefined,new Error('Stockfish search timed out')),SEARCH_TIMEOUT_MS);
   currentWorker.postMessage('setoption name Skill Level value '+Math.min(20,Math.max(0,Math.round(skill))));
   currentWorker.postMessage('setoption name Threads value 1');
   currentWorker.postMessage('ucinewgame');
   currentWorker.postMessage('position fen '+toFEN(position));
   currentWorker.postMessage('go depth '+Math.min(18,Math.max(1,Math.round(depth))));
  });
 }finally{busy=false}
}

export function disposeStockfish():void{
 worker?.terminate();
 worker=undefined;
 ready=undefined;
 busy=false;
}

export type EngineEvaluation={scoreCp:number;mate?:number};

export function parseStockfishEvaluation(line:string,turn:'w'|'b'):EngineEvaluation|undefined{
 const cp=line.match(/\bscore cp (-?\\d+)/);const mate=line.match(/\bscore mate (-?\\d+)/);if(!cp&&!mate)return undefined;
 const sign=turn==='w'?1:-1;
 return cp?{scoreCp:Number(cp[1])*sign}: {scoreCp:0,mate:Number(mate![1])*sign};
}

export async function requestStockfishEvaluation(position:Position,depth:number,signal?:AbortSignal):Promise<EngineEvaluation>{
 if(signal?.aborted)return {scoreCp:0};
 if(busy)throw new Error('Stockfish engine is busy');
 busy=true;
 try{
  await ensureWorker();
  const currentWorker=worker;if(!currentWorker)throw new Error('Stockfish worker unavailable');
  return await new Promise<EngineEvaluation>((resolve,reject)=>{
   let timer:ReturnType<typeof setTimeout>|undefined;let settled=false;let latest:EngineEvaluation={scoreCp:0};
   const finish=(value:EngineEvaluation,error?:Error)=>{if(settled)return;settled=true;if(timer)clearTimeout(timer);signal?.removeEventListener('abort',abort);if(error)reject(error);else resolve(value)};
   const abort=()=>{try{currentWorker.postMessage('stop')}catch{}finish(latest)};
   signal?.addEventListener('abort',abort,{once:true});
   if(signal?.aborted){abort();return}
   currentWorker.onmessage=(event:MessageEvent)=>{const line=String(event.data??'');const score=parseStockfishEvaluation(line,position.turn);if(score)latest=score;if(line.startsWith('bestmove '))finish(latest)};
   currentWorker.onerror=()=>finish(latest,new Error('Stockfish worker failed during evaluation'));
   timer=setTimeout(()=>finish(latest,new Error('Stockfish evaluation timed out')),SEARCH_TIMEOUT_MS);
   currentWorker.postMessage('setoption name Threads value 1');
   currentWorker.postMessage('ucinewgame');
   currentWorker.postMessage('position fen '+toFEN(position));
   currentWorker.postMessage('go depth '+Math.min(14,Math.max(1,Math.round(depth))));
  });
 }finally{busy=false}
}
