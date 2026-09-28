import {getGame} from './db';
import type {PersistedGameSnapshot} from './activeGame';

export async function loadPersistedGame<T>(id='active'){return getGame<T>(id)}

export function isRecoverableGame(v:unknown):v is PersistedGameSnapshot{
  if(!v||typeof v!=='object')return false;
  const x=v as Record<string,unknown>;
  return typeof x.id==='string'&&typeof x.startFEN==='string'&&typeof x.updatedAt==='number'&&
    typeof x.schemaVersion==='number'&&!!x.position&&Array.isArray(x.history)&&Array.isArray(x.future)&&Array.isArray(x.keys);
}

export function selectRecoverySnapshot(primary:PersistedGameSnapshot|undefined,backup:PersistedGameSnapshot|undefined){
  const candidates=[primary,backup].filter((v):v is PersistedGameSnapshot=>isRecoverableGame(v));
  return candidates.sort((a,b)=>b.updatedAt-a.updatedAt)[0];
}
