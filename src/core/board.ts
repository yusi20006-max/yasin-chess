import type { Color, Piece, Position, Square } from './types';
import {FILES,START_FEN} from './constants';
export const sq=(file:number,rank:number)=>rank*8+file;
export const fileOf=(s:Square)=>s&7;
export const rankOf=(s:Square)=>s>>3;
export const squareName=(s:Square)=>FILES[fileOf(s)]+(rankOf(s)+1);
export const parseSquare=(s:string)=>FILES.indexOf(s[0])+8*(Number(s[1])-1);
export const other=(c:Color):Color=>c==='w'?'b':'w';
export function emptyBoard(){return Array<Piece|null>(64).fill(null);}
export function initialPosition():Position{return fromFEN(START_FEN);}
export function clonePosition(p:Position):Position{return {...p,board:[...p.board],castling:{...p.castling}};}
export function fromFEN(fen:string):Position{
 const [placement,turn,rights,ep,half='0',full='1']=fen.trim().split(/\s+/); const board=emptyBoard();
 placement.split('/').forEach((row,ri)=>{let f=0; for(const ch of row){if(/\d/.test(ch))f+=Number(ch);else{const color=ch===ch.toUpperCase()?'w':'b'; board[sq(f,7-ri)]={color,type:ch.toLowerCase() as Piece['type']};f++;}}});
 return {board,turn:turn as Color,castling:{wK:rights.includes('K'),wQ:rights.includes('Q'),bK:rights.includes('k'),bQ:rights.includes('q')},ep:ep==='-'?null:parseSquare(ep),halfmove:Number(half),fullmove:Number(full)};
}
export function toFEN(p:Position){let rows:string[]=[];for(let r=7;r>=0;r--){let n=0,row='';for(let f=0;f<8;f++){const pc=p.board[sq(f,r)];if(!pc)n++;else{if(n){row+=n;n=0}row+=pc.color==='w'?pc.type.toUpperCase():pc.type}}if(n)row+=n;rows.push(row)} const rights=(p.castling.wK?'K':'')+(p.castling.wQ?'Q':'')+(p.castling.bK?'k':'')+(p.castling.bQ?'q':''); return `${rows.join('/')} ${p.turn} ${rights||'-'} ${p.ep===null?'-':squareName(p.ep)} ${p.halfmove} ${p.fullmove}`;}
export function positionKey(p:Position){return toFEN({...p,halfmove:0,fullmove:1}).split(' ').slice(0,4).join(' ');}
