import {chooseMove} from './minimax';
import type {Move,Position} from '../core/types';

type Request = { id:number; position:Position; depth:number };
type Response = { id:number; move?:Move };

self.onmessage = (event: MessageEvent<Request>) => {
  const {id,position,depth}=event.data;
  const move=chooseMove(position,depth);
  (self as unknown as Worker).postMessage({id,move} satisfies Response);
};
