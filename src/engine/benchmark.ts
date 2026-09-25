import {chooseMove} from './minimax';import type {Position} from '../core/types';
export type BenchmarkCase={name:string;position:Position;expectedFrom?:number;expectedTo?:number};
export function benchmark(cases:BenchmarkCase[],depth=3){const start=performance.now();const results=cases.map(c=>{const t=performance.now();const move=chooseMove(c.position,depth);return {name:c.name,move,ms:performance.now()-t,matched:c.expectedFrom===undefined||!!move&&move.from===c.expectedFrom&&move.to===c.expectedTo}});return {depth,elapsedMs:performance.now()-start,results}}
