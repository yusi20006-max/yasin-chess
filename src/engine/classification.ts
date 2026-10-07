import {PIECE_VALUE} from '../core/constants';
import type {Move,Position} from '../core/types';
import {requestEngineEvaluation,type EngineEvaluation,type EngineId} from './adapter';

export type MoveClass='brilliant'|'excellent'|'good'|'inaccuracy'|'mistake'|'blunder';
export type MoveClassification={ply:number;move:Move;classification:MoveClass;lossPercent:number;approximate:boolean};

function winPercent(cp:number,mate?:number){if(mate!==undefined)return mate>0?100:0;return 50+50*(2/(1+Math.exp(-0.00368208*cp))-1);}
function moverWin(e:EngineEvaluation,color:'w'|'b'){const white=winPercent(e.scoreCp,e.mate);return color==='w'?white:100-white;}
function material(p:Position,color:'w'|'b'){let n=0;for(const piece of p.board)if(piece?.color===color)n+=PIECE_VALUE[piece.type];return n;}

export function classifyEvaluation(before:EngineEvaluation,after:EngineEvaluation,color:'w'|'b',approximate:boolean,materialLoss=0):MoveClass{
 const loss=Math.max(0,moverWin(before,color)-moverWin(after,color));
 if(!approximate&&materialLoss>=200&&loss<2&&moverWin(after,color)>=45)return 'brilliant';
 if(loss<2)return 'excellent';
 if(loss<5)return 'good';
 if(loss<10)return 'inaccuracy';
 if(loss<20)return 'mistake';
 return 'blunder';
}

export async function analyzeGame(history:Array<{move:Move;before:Position;after:Position}>,engine:EngineId,depth:number,signal?:AbortSignal,onProgress?:(done:number,total:number)=>void):Promise<MoveClassification[]>{
 const results:MoveClassification[]=[];
 for(let i=0;i<history.length;i++){
  if(signal?.aborted)break;
  const item=history[i];
  const before=await requestEngineEvaluation(engine,item.before,depth,signal);
  const after=await requestEngineEvaluation(engine,item.after,depth,signal);
  const loss=Math.max(0,moverWin(before,item.move.from>=0?item.before.turn:'w')-moverWin(after,item.before.turn));
  const materialLoss=Math.max(0,material(item.before,item.before.turn)-material(item.after,item.before.turn));
  const classification=classifyEvaluation(before,after,item.before.turn,before.approximate||after.approximate,materialLoss);
  results.push({ply:i+1,move:item.move,classification,lossPercent:loss,approximate:before.approximate||after.approximate});
  onProgress?.(i+1,history.length);
 }
 return results;
}
