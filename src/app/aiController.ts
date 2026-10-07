import {legalMoves} from '../core/moves';
import type {Move,Position} from '../core/types';
import {requestEngineMove,type EngineId} from '../engine/adapter';
import {requestAiMove} from '../engine/aiWorker';

function sameMove(a:Move,b:Move):boolean{return a.from===b.from&&a.to===b.to&&a.promotion===b.promotion;}
function isLegalMove(position:Position,move:Move|undefined):move is Move{if(!move)return false;return legalMoves(position).some(candidate=>sameMove(candidate,move));}

export type AiControllerRequest={
 position:Position;
 depth:number;
 signal?:AbortSignal;
 engine?:EngineId;
 skill?:number;
};

export async function requestAiTurn({position,depth,signal,engine='minimax',skill=10}:AiControllerRequest):Promise<Move|undefined>{
 if(signal?.aborted)return undefined;
 let move:Move|undefined;
 if(engine==='stockfish'){
  try{
   move=await requestEngineMove({position,depth,skill,engine,signal});
  }catch{
   move=await requestAiMove(position,depth,signal);
  }
 }else{
  move=await requestAiMove(position,depth,signal);
 }
 if(signal?.aborted)return undefined;
 return isLegalMove(position,move)?move:undefined;
}
