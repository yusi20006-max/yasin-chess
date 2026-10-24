import {ChessGame} from '../core/game';
import {getGame,putGame,deleteGame} from './db';
import {selectRecoverySnapshot} from './recovery';
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
  terminalState?:{drawAgreement?:boolean;timeoutLoser?:'w'|'b'|null;timeoutDraw?:boolean};
  clockMs?:{w:number;b:number};
  timeControlId?:string;
};

export function serializeActiveGame(game:ChessGame,clockMs?:{w:number;b:number},timeControlId?:string,id=ACTIVE_ID):PersistedGameSnapshot{
 return {id,schemaVersion:CURRENT_SCHEMA_VERSION,updatedAt:Date.now(),startFEN:game.startFEN,position:game.position,history:game.history,future:game.future,keys:game.keys,terminalState:game.terminalState(),...(clockMs?{clockMs}:{}),...(timeControlId?{timeControlId}:{})};
}
export function deserializeActiveGame(raw:PersistedGameSnapshot){
 const value=migrate(raw,raw.schemaVersion);const g=new ChessGame(value.startFEN);g.position=value.position;g.history=value.history;g.future=value.future??[];g.keys=value.keys??[];g.restoreTerminalState(value.terminalState??{});return {game:g,clockMs:value.clockMs,timeControlId:value.timeControlId};
}

export async function resumeActiveGameState(){try{const primary=await getGame<PersistedGameSnapshot>(ACTIVE_ID);const backup=await getGame<PersistedGameSnapshot>(ACTIVE_BACKUP_ID);const raw=selectRecoverySnapshot(primary,backup);return raw?deserializeActiveGame(raw):undefined}catch{return undefined}}
export async function resumeActiveGame(){return (await resumeActiveGameState())?.game}

export async function saveActiveGame(game:ChessGame,clockMs?:{w:number;b:number},timeControlId?:string){
  const previous=await getGame<PersistedGameSnapshot>(ACTIVE_ID);
  if(previous&&selectRecoverySnapshot(previous,undefined))await putGame({...previous,id:ACTIVE_BACKUP_ID});
  await putGame(serializeActiveGame(game,clockMs,timeControlId));
}

export async function clearActiveGame(){
  await deleteGame(ACTIVE_ID);
  await deleteGame(ACTIVE_BACKUP_ID);
}
