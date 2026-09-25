import {chooseMove} from './minimax';import type {Move,Position} from '../core/types';
export function iterativeDeepening(p:Position,maxDepth:number,onDepth?:(depth:number,move:Move|undefined)=>void){let best:Move|undefined;for(let d=1;d<=Math.max(1,maxDepth);d++){best=chooseMove(p,d);onDepth?.(d,best)}return best}
