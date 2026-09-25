import type {Position,Move} from '../core/types';import {positionKey} from '../core/board';
export type TTEntry={depth:number;score:number;move?:Move};
export class TranspositionTable{private map=new Map<string,TTEntry>();get(p:Position){return this.map.get(positionKey(p))}set(p:Position,e:TTEntry){const k=positionKey(p),old=this.map.get(k);if(!old||e.depth>=old.depth)this.map.set(k,e)}clear(){this.map.clear()}size(){return this.map.size}}
