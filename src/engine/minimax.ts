import {applyMove,inCheck,isInsufficientMaterial,legalMoves} from '../core/moves';
import {PIECE_VALUE} from '../core/constants';
import type {Move,Position} from '../core/types';
import {bookMove} from './openingBook';

export type SearchOptions={
  timeBudgetMs?:number;
  signal?:AbortSignal;
  onNode?:()=>void;
};

export type SearchResult={move?:Move;depth:number;nodes:number;timedOut:boolean};

class SearchStopped extends Error {}

const pst=(type:string,i:number)=>{
  const r=i>>3,f=i&7;
  const center=3.5-Math.abs(3.5-f)+3.5-Math.abs(3.5-r);
  if(type==='p')return r*8+center*2;
  if(type==='n')return center*10;
  if(type==='b')return center*7;
  if(type==='r')return r*2;
  if(type==='q')return center*2;
  return 0;
};
function evaluateWhite(p:Position){
  let score=0;
  for(let i=0;i<64;i++){
    const x=p.board[i];
    if(!x)continue;
    const v=PIECE_VALUE[x.type]+pst(x.type,i);
    score+=x.color==='w'?v:-v;
  }
  return score;
}
function evaluateForSide(p:Position){
  const ms=legalMoves(p);
  if(!ms.length)return inCheck(p,p.turn)?-999999:0;
  if(isInsufficientMaterial(p))return 0;
  const whiteScore=evaluateWhite(p);
  return p.turn==='w'?whiteScore:-whiteScore;
}
type Context={deadline:number;signal?:AbortSignal;nodes:number;onNode?:()=>void};
function checkpoint(ctx:Context){
  ctx.nodes++;
  ctx.onNode?.();
  if(ctx.signal?.aborted||performance.now()>=ctx.deadline)throw new SearchStopped();
}
const QUIESCENCE_MAX_DEPTH=3;
function quiescence(p:Position,alpha:number,beta:number,ctx:Context,depth:number):number{
 checkpoint(ctx);
 const stand=evaluateForSide(p);
 if(depth<=0)return stand;
 if(stand>=beta)return stand;
 if(stand>alpha)alpha=stand;
 const ms=legalMoves(p);
 const tactical=ms.filter(m=>Boolean(p.board[m.to])||Boolean(m.promotion)||inCheck(applyMove(p,m),applyMove(p,m).turn));
 for(const m of tactical){
  const score=-quiescence(applyMove(p,m),-beta,-alpha,ctx,depth-1);
  if(score>=beta)return score;
  if(score>alpha)alpha=score;
 }
 return alpha;
}
function negamax(p:Position,depth:number,alpha:number,beta:number,ctx:Context):number{
  checkpoint(ctx);
  const ms=legalMoves(p);
  if(!ms.length)return inCheck(p,p.turn)?-999999:0;
  if(depth===0)return quiescence(p,alpha,beta,ctx,QUIESCENCE_MAX_DEPTH);
  let best=-Infinity;
  for(const m of ms){
    const score=-negamax(applyMove(p,m),depth-1,-beta,-alpha,ctx);
    if(score>best)best=score;
    if(score>alpha)alpha=score;
    if(alpha>=beta)break;
  }
  return best;
}
function orderedMoves(p:Position,ms:Move[]){
  return [...ms].sort((a,b)=>{
    const ac=Number(Boolean(p.board[a.to]))+Number(Boolean(a.promotion))*2;
    const bc=Number(Boolean(p.board[b.to]))+Number(Boolean(b.promotion))*2;
    return bc-ac;
  });
}

export function searchBestMove(p:Position,depth:number,options:SearchOptions={}):SearchResult{
  if(options.signal?.aborted)return {depth:0,nodes:0,timedOut:true};
  const opening=bookMove(p);
  if(opening)return {move:opening,depth:0,nodes:0,timedOut:false};
  const ms=legalMoves(p);
  if(!ms.length)return {depth:0,nodes:0,timedOut:false};
  const budget=Math.max(1,Number.isFinite(options.timeBudgetMs??1500)?(options.timeBudgetMs??1500):1500);
  const ctx:Context={deadline:performance.now()+budget,signal:options.signal,nodes:0,onNode:options.onNode};
  let best=ms[0];
  let completedDepth=0;
  let timedOut=false;
  try{
    for(let currentDepth=1;currentDepth<=Math.max(1,Math.floor(depth));currentDepth++){
      let depthBest:Move|undefined;
      let depthScore=-Infinity;
      for(const m of orderedMoves(p,ms)){
        const score=-negamax(applyMove(p,m),currentDepth-1,-Infinity,Infinity,ctx);
        if(score>depthScore){depthScore=score;depthBest=m;}
      }
      if(depthBest){
        best=depthBest;
        completedDepth=currentDepth;
      }
    }
  }catch(error){
    if(error instanceof SearchStopped)timedOut=true;
    else throw error;
  }
  return {move:best,depth:completedDepth,nodes:ctx.nodes,timedOut};
}

export function chooseMove(p:Position,depth:number,options:SearchOptions={}):Move|undefined{
  return searchBestMove(p,depth,options).move;
}
