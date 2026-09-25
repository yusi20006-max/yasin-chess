import {applyMove,fileOf,squareName} from './board';
import {inCheck,legalMoves} from './moves';
import type {Move,Position} from './types';
export function toSAN(p:Position,m:Move):string{const pc=p.board[m.from]!;if(m.isCastle)return m.to>m.from?'O-O':'O-O-O';const capture=!!p.board[m.to]||!!m.isEnPassant;let s=pc.type==='p'?(capture?String.fromCharCode(97+fileOf(m.from)): ''):pc.type.toUpperCase();if(pc.type!=='p'){const peers=legalMoves(p).filter(x=>x.to===m.to&&x.from!==m.from&&p.board[x.from]?.type===pc.type);if(peers.length){const sameFile=peers.some(x=>fileOf(x.from)===fileOf(m.from));s+=sameFile?squareName(m.from)[1]:String.fromCharCode(97+fileOf(m.from))}}if(capture)s+='x';s+=squareName(m.to);if(m.promotion)s+='='+m.promotion.toUpperCase();const n=applyMove(p,m);if(inCheck(n,n.turn)){s+=legalMoves(n).length?'+' : '#'}return s}
export function moveToUci(m:Move){return squareName(m.from)+squareName(m.to)+(m.promotion??'')}
