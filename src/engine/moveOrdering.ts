import {toSAN} from '../core/san';import type {Move,Position} from '../core/types';
export function orderMoves(p:Position,moves:Move[],preferred?:Move){return [...moves].sort((a,b)=>Number(b===preferred)-Number(a===preferred)||Number(!!p.board[b.to])-Number(!!p.board[a.to])||toSAN(p,a).localeCompare(toSAN(p,b)))}
