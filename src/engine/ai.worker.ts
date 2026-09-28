import {chooseMove} from './minimax';
import type {Move,Position} from '../core/types';
export type AiWorkerRequest={type:'request';id:number;position:Position;depth:number;timeBudgetMs?:number};
export type AiWorkerAbort={type:'abort';id:number};
export type AiWorkerMessage=AiWorkerRequest|AiWorkerAbort;
export type AiWorkerResponse={type:'response';id:number;move?:Move;depth:number;nodes:number;timedOut:boolean}|{type:'error';id:number;code:'SEARCH_ERROR';message:string};
const cancelled=new Set<number>();
self.onmessage=(event:MessageEvent<AiWorkerMessage>)=>{
 const message=event.data;
 if(message.type==='abort'){cancelled.add(message.id);return}
 if(cancelled.has(message.id))return;
 try{
  const result=chooseMove(message.position,message.depth,{timeBudgetMs:message.timeBudgetMs});
  if(cancelled.has(message.id))return;
  (self as unknown as Worker).postMessage({type:'response',id:message.id,...result} satisfies AiWorkerResponse);
 }catch(error){
  if(cancelled.has(message.id))return;
  (self as unknown as Worker).postMessage({type:'error',id:message.id,code:'SEARCH_ERROR',message:error instanceof Error?error.message:String(error)} satisfies AiWorkerResponse);
 }finally{cancelled.delete(message.id)}
};