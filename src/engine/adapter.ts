import type {Move,Position} from '../core/types';
import {evaluatePosition} from './evaluation';
import {requestStockfishEvaluation,requestStockfishMove} from './stockfish';
import {requestAiMove} from './aiWorker';

export type EngineId='minimax'|'stockfish';
export type EngineRequest={position:Position;depth:number;skill:number;engine?:EngineId;signal?:AbortSignal};
export type EngineEvaluation={scoreCp:number;mate?:number;approximate:boolean;source:EngineId};

export interface ChessEngineAdapter{
 readonly id:EngineId;
 requestMove(request:EngineRequest):Promise<Move|undefined>;
 evaluate(position:Position,depth:number,signal?:AbortSignal):Promise<EngineEvaluation>;
}

const minimaxAdapter:ChessEngineAdapter={
 id:'minimax',
 requestMove:({position,depth,signal})=>requestAiMove(position,depth,signal),
 async evaluate(position){return {scoreCp:evaluatePosition(position),approximate:true,source:'minimax'};}
};

const stockfishAdapter:ChessEngineAdapter={
 id:'stockfish',
 requestMove:({position,depth,skill,signal})=>requestStockfishMove(position,depth,skill,signal),
 async evaluate(position,depth,signal){const value=await requestStockfishEvaluation(position,depth,signal);return {...value,approximate:false,source:'stockfish'};}
};

export function getChessEngine(id:EngineId):ChessEngineAdapter{return id==='stockfish'?stockfishAdapter:minimaxAdapter;}
export async function requestEngineMove(request:EngineRequest):Promise<Move|undefined>{return getChessEngine(request.engine??'minimax').requestMove(request);}
export async function requestEngineEvaluation(id:EngineId,position:Position,depth:number,signal?:AbortSignal):Promise<EngineEvaluation>{return getChessEngine(id).evaluate(position,depth,signal);}
