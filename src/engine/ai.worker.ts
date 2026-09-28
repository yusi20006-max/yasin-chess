import {chooseMove} from './minimax';
import type {Move,Position} from '../core/types';

export type AiWorkerRequest={id:number;position:Position;depth:number;timeBudgetMs?:number};
export type AiWorkerResponse={id:number;move?:Move;depth?:number;nodes?:number;timedOut?:boolean};

self.onmessage=(event:MessageEvent<AiWorkerRequest>)=>{
  const {id,position,depth,timeBudgetMs}=event.data;
  const result=chooseMove(position,depth,{timeBudgetMs});
  (self as unknown as Worker).postMessage({id,...result} satisfies AiWorkerResponse);
};
