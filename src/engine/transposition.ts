import type {Move,Position} from '../core/types';
import {positionKey} from '../core/board';
export type TTBound='exact'|'lower'|'upper';
export type TTEntry={depth:number;score:number;move?:Move;bound:TTBound};
export class TranspositionTable{
 private map=new Map<string,TTEntry>();
 constructor(private readonly maxEntries=4096){}
 get(p:Position,depth?:number,alpha?:number,beta?:number){
  const e=this.map.get(positionKey(p));
  if(!e||depth===undefined||alpha===undefined||beta===undefined)return e;
  if(e.depth<depth)return undefined;
  if(e.bound==='exact'||(e.bound==='lower'&&e.score>=beta)||(e.bound==='upper'&&e.score<=alpha))return e;
  return undefined;
 }
 set(p:Position,e:TTEntry){
  const k=positionKey(p);const old=this.map.get(k);
  if(old&&old.depth>e.depth)return;
  if(old)this.map.delete(k);
  this.map.set(k,e);
  while(this.map.size>this.maxEntries){const first=this.map.keys().next().value;if(first===undefined)break;this.map.delete(first)}
 }
 clear(){this.map.clear()}
 size(){return this.map.size}
}
