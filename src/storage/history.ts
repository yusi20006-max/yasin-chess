import {listGames,deleteGame} from './db';
export type StoredGame={id:string;startFEN:string;updatedAt:number;position:unknown;history:unknown[]};
export const getGameHistory=()=>listGames<StoredGame>();
export const removeGameFromHistory=(id:string)=>deleteGame(id);
