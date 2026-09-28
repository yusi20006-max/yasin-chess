import {legalMoves} from '../core/moves';
import type {Move,Position} from '../core/types';
import {requestAiMove} from '../engine/aiWorker';

function sameMove(a:Move,b:Move):boolean{
  return a.from===b.from&&a.to===b.to&&a.promotion===b.promotion;
}

function isLegalMove(position:Position,move:Move|undefined):move is Move{
  if(!move)return false;
  return legalMoves(position).some(candidate=>sameMove(candidate,move));
}

export type AiControllerRequest={
  position:Position;
  depth:number;
  signal?:AbortSignal;
};

export async function requestAiTurn({
  position,
  depth,
  signal,
}:AiControllerRequest):Promise<Move|undefined>{
  if(signal?.aborted)return undefined;
  const move=await requestAiMove(position,depth,signal);
  if(signal?.aborted)return undefined;
  return isLegalMove(position,move)?move:undefined;
}
