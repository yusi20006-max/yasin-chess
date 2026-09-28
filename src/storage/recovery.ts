import {fromFEN} from '../core/board';
import {getGame} from './db';
import type {PersistedGameSnapshot} from './activeGame';

export async function loadPersistedGame<T>(id='active'){return getGame<T>(id)}

export function isRecoverableGame(v:unknown):v is PersistedGameSnapshot{
  if(!v||typeof v!=='object')return false;
  const x=v as Record<string,unknown>;
  if(typeof x.id!=='string'||typeof x.startFEN!=='string'||typeof x.updatedAt!=='number'||!Number.isFinite(x.updatedAt)||
     typeof x.schemaVersion!=='number'||!Number.isInteger(x.schemaVersion)||x.schemaVersion<1||
     !x.position||typeof x.position!=='object'||!Array.isArray(x.history)||!Array.isArray(x.future)||!Array.isArray(x.keys))return false;
  try{
    fromFEN(x.startFEN);
    const p=x.position as Record<string,unknown>;
    if(!Array.isArray(p.board)||p.board.length!==64)return false;
    if(p.turn!=='w'&&p.turn!=='b')return false;
    if(!p.castling||typeof p.castling!=='object')return false;
    if(typeof p.halfmove!=='number'||!Number.isInteger(p.halfmove)||p.halfmove<0)return false;
    if(typeof p.fullmove!=='number'||!Number.isInteger(p.fullmove)||p.fullmove<1)return false;
    return true;
  }catch{return false}
}

export function selectRecoverySnapshot(primary:PersistedGameSnapshot|undefined,backup:PersistedGameSnapshot|undefined){
  const candidates=[primary,backup].filter((v):v is PersistedGameSnapshot=>isRecoverableGame(v));
  return candidates.sort((a,b)=>b.updatedAt-a.updatedAt)[0];
}
