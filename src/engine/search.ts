import type {Move,Position} from '../core/types';
import {searchBestMove,type SearchOptions,type SearchResult} from './minimax';
export type EngineSearch={search:(position:Position,depth:number,options?:SearchOptions)=>SearchResult};
export const minimaxSearch:EngineSearch={search:searchBestMove};
export function searchMove(engine:EngineSearch,position:Position,depth:number,options?:SearchOptions):Move|undefined{return engine.search(position,depth,options).move}
