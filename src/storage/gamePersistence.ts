import {putGame} from './db';import type {ChessGame} from '../core/game';
export type PersistedGameMeta={mode?:string;difficulty?:string};
export function persistGame(game:ChessGame,id='active',meta:PersistedGameMeta={}){return putGame({id,startFEN:game.startFEN,position:game.position,history:game.history,future:game.future,keys:game.keys,updatedAt:Date.now(),result:game.resultToken(),...meta})}
