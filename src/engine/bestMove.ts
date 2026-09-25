import {chooseMove} from './minimax';import type {Move,Position} from '../core/types';
export function bestMove(position:Position,depth:number):Move|undefined{return chooseMove(position,depth)}
export function sameMove(a:Move|undefined,b:Move|undefined){return Boolean(a&&b&&a.from===b.from&&a.to===b.to&&a.promotion===b.promotion)}