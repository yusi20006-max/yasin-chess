import type {Move,Position} from '../core/types';import {positionKey} from '../core/board';
const BOOK:Record<string,Move[]>={};
export function addOpening(position:Position,moves:Move[]){BOOK[positionKey(position)]=moves.map(m=>({...m}))}
export function openingMoves(position:Position){return (BOOK[positionKey(position)]??[]).map(m=>({...m}))}
export function hasOpening(position:Position){return openingMoves(position).length>0}
