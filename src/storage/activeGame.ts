import {ChessGame} from '../core/game';import {loadPersistedGame,isRecoverableGame} from './recovery';
export async function resumeActiveGame(){const raw=await loadPersistedGame<any>();if(!raw||!isRecoverableGame(raw))return undefined;const g=new ChessGame(raw.startFEN);g.position=raw.position;g.history=raw.history;g.future=raw.future??[];g.keys=raw.keys??[];return g}
