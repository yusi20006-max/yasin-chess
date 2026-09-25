import {initialPosition,positionKey} from '../core/board';
import {legalMoves} from '../core/moves';
import type {Move,Position} from '../core/types';

type BookEntry={from:number;to:number};
const entries:Record<string,BookEntry[]>={
  [positionKey(initialPosition())]:[{from:12,to:28},{from:11,to:27},{from:10,to:26},{from:9,to:25},{from:13,to:29},{from:14,to:30}]
};
let enabled=true;
export function setOpeningBookEnabled(value:boolean){enabled=value}
export function isOpeningBookEnabled(){return enabled}
export function bookMove(position:Position):Move|undefined{
  if(!enabled)return undefined;
  const legal=legalMoves(position);
  const candidates=entries[positionKey(position)]??[];
  return candidates.map(x=>legal.find(m=>m.from===x.from&&m.to===x.to)).find(Boolean);
}
export function openingBookSize(){return Object.keys(entries).length}
