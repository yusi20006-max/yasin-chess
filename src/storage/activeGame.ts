import {ChessGame} from '../core/game';
import {getGame,putGame,deleteGame} from './db';
import {isRecoverableGame} from './recovery';
const ACTIVE_ID='active';
type GameSnapshot={id:string;startFEN:string;position:ChessGame['position'];history:ChessGame['history'];future:ChessGame['future'];keys:string[]};
export async function resumeActiveGame(){try{const raw=await getGame<GameSnapshot>(ACTIVE_ID);if(!raw||!isRecoverableGame(raw))return undefined;const g=new ChessGame(raw.startFEN);g.position=raw.position;g.history=raw.history;g.future=raw.future??[];g.keys=raw.keys??[];return g}catch{return undefined}}
export async function saveActiveGame(game:ChessGame){const snapshot:GameSnapshot={id:ACTIVE_ID,startFEN:game.startFEN,position:game.position,history:game.history,future:game.future,keys:game.keys};await putGame(snapshot)}
export async function clearActiveGame(){await deleteGame(ACTIVE_ID)}
