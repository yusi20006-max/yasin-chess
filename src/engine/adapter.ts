import type {Move,Position} from '../core/types';
import {requestStockfishMove} from './stockfish';
import {requestAiMove} from './aiWorker';

export type EngineId='minimax'|'stockfish';
export type EngineRequest={position:Position;depth:number;skill:number;signal?:AbortSignal};

export interface ChessEngineAdapter{
 readonly id:EngineId;
 requestMove(request:EngineRequest):Promise<Move|undefined>;
}

const minimaxAdapter:ChessEngineAdapter={
 id:'minimax',
 requestMove:({position,depth,signal})=>requestAiMove(position,depth,signal)
};

const stockfishAdapter:ChessEngineAdapter={
 id:'stockfish',
 requestMove:({position,depth,skill,signal})=>requestStockfishMove(position,depth,skill,signal)
};

export function getChessEngine(id:EngineId):ChessEngineAdapter{
 return id==='stockfish'?stockfishAdapter:minimaxAdapter;
}

export async function requestEngineMove(request:EngineRequest):Promise<Move|undefined>{
 return getChessEngine(request.engine??'minimax').requestMove(request);
}
