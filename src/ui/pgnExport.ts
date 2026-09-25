import type {ChessGame} from '../core/game';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export function exportPGN(game:ChessGame,headers:Record<string,string>={}){return game.pgn(headers)}

export async function sharePGN(game:ChessGame){
  const text=game.pgn();
  if(Capacitor.isNativePlatform()){
    await Share.share({title:'Yasin Chess PGN',text,dialogTitle:'Share PGN'});
    return;
  }
  if(navigator.share) await navigator.share({title:'Yasin Chess PGN',text});
  else await navigator.clipboard.writeText(text);
}
