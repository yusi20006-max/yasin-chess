import {applyMove,inCheck,isInsufficientMaterial,legalMoves} from '../core/moves';
import {PIECE_VALUE} from '../core/constants';
import type {Move,Position} from '../core/types';
const pst=(type:string,i:number)=>{const r=i>>3,f=i&7;const center=3.5-Math.abs(3.5-f)+3.5-Math.abs(3.5-r);if(type==='p')return r*8+center*2;if(type==='n')return center*10;if(type==='b')return center*7;if(type==='r')return r*2;if(type==='q')return center*2;return 0};
function evaluateWhite(p:Position){let score=0;for(let i=0;i<64;i++){const x=p.board[i];if(!x)continue;const v=PIECE_VALUE[x.type]+pst(x.type,i);score+=x.color==='w'?v:-v}return score}
function evaluateForSide(p:Position){const ms=legalMoves(p);if(!ms.length)return inCheck(p,p.turn)?-999999:0;if(isInsufficientMaterial(p))return 0;const whiteScore=evaluateWhite(p);return p.turn==='w'?whiteScore:-whiteScore}
function negamax(p:Position,depth:number,alpha:number,beta:number):number{const ms=legalMoves(p);if(!ms.length)return inCheck(p,p.turn)?-999999:0;if(depth===0)return evaluateForSide(p);let best=-Infinity;for(const m of ms){const score=-negamax(applyMove(p,m),depth-1,-beta,-alpha);if(score>best)best=score;if(score>alpha)alpha=score;if(alpha>=beta)break}return best}
export function chooseMove(p:Position,depth:number):Move|undefined{const ms=legalMoves(p);let best:Move|undefined,bestScore=-Infinity;for(const m of ms){const score=-negamax(applyMove(p,m),Math.max(0,depth-1),-Infinity,Infinity);if(score>bestScore){bestScore=score;best=m}}return best}
