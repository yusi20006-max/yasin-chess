import type {Move,Position} from '../core/types';
import {chooseMove} from '../engine/minimax';
export type ThinkingState={active:boolean;startedAt:number;elapsedMs:number;requestId:number};
export function createThinkingState(requestId=0):ThinkingState{return {active:false,startedAt:0,elapsedMs:0,requestId}}
export function startThinking(state:ThinkingState,requestId:number,now=Date.now()):ThinkingState{return {...state,active:true,startedAt:now,elapsedMs:0,requestId}}
export function stopThinking(state:ThinkingState,now=Date.now()):ThinkingState{return {...state,active:false,elapsedMs:state.active?Math.max(0,now-state.startedAt):state.elapsedMs}}
export function runAI(position:Position,depth:number,signal?:AbortSignal):Promise<Move|undefined>{return new Promise(resolve=>{if(signal?.aborted)return resolve(undefined);const id=window.setTimeout(()=>{if(signal?.aborted)return resolve(undefined);resolve(chooseMove(position,depth))},0);signal?.addEventListener('abort',()=>{window.clearTimeout(id);resolve(undefined)},{once:true})})}
