import {getGame} from './db';
export async function loadPersistedGame<T>(id='active'){return getGame<T>(id)}
export function isRecoverableGame(v:unknown):boolean{if(!v||typeof v!=='object')return false;const x=v as Record<string,unknown>;return typeof x.startFEN==='string'&&!!x.position&&Array.isArray(x.history)}
