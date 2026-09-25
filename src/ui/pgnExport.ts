import type {ChessGame} from '../core/game';
export function exportPGN(game:ChessGame,headers:Record<string,string>={}){return game.pgn(headers)}
export async function sharePGN(game:ChessGame){const text=game.pgn();if(navigator.share)await navigator.share({title:'Yasin Chess PGN',text});else await navigator.clipboard.writeText(text)}
