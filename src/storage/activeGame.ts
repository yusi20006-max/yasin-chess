import {ChessGame} from '../core/game';
import {getGame,putGame,deleteGame} from './db';
import {isRecoverableGame} from './recovery';
import {CURRENT_SCHEMA_VERSION,migrate} from './migrations';

export const ACTIVE_ID='active';
export const ACTIVE_BACKUP_ID='active:backup';

export type PersistedGameSnapshot={
  id:string;
  schemaVersion:number;
  updatedAt:number;
  startFEN:string;
  position:ChessGame['position'];
  history:ChessGame['history'];
  future:ChessGame['future'];
  keys:string[];
};

function snapshot(game:ChessGame,id=ACTIVE_ID):PersistedGameSnapshot{
  return {id,schemaVersion:CURRENT_SCHEMA_VERSION,updatedAt:Date.now(),startFEN:game.startFEN,position:game.position,history:game.history,future:game.future,keys:game.keys};
}

export async function resumeActiveGame(){
  try{
    const raw=await getGame<PersistedGameSnapshot>(ACTIVE_ID);
    if(!raw||!isRecoverableGame(raw))return undefined;
    const value=migrate(raw,raw.schemaVersion);
    const g=new ChessGame(value.startFEN);
    g.position=value.position;
    g.history=value.history;
    g.future=value.future??[];
    g.keys=value.keys??[];
    return g;
  }catch{return undefined}
}

export async function saveActiveGame(game:ChessGame){
  await putGame(snapshot(game));
}

export async function clearActiveGame(){
  await deleteGame(ACTIVE_ID);
  await deleteGame(ACTIVE_BACKUP_ID);
}
