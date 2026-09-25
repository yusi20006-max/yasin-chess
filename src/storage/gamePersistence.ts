import {putGame} from './db';import type {ChessGame} from '../core/game';
export function persistGame(game:ChessGame,id='active'){return putGame({id,startFEN:game.startFEN,position:game.position,history:game.history,future:game.future,keys:game.keys,updatedAt:Date.now()})}
