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
 const fields=fen.trim().split(/\s+/);
 if(fields.length!==6) throw new Error('Invalid FEN: expected 6 fields');
 const [placement,turn,rights,ep,half,full]=fields;
 const rows=placement.split('/');
 if(rows.length!==8) throw new Error('Invalid FEN: expected 8 ranks');
 const board=emptyBoard();
 const validPieces='pnbrqkPNBRQK';
 rows.forEach((row,ri)=>{
  let f=0;
  for(const ch of row){
   if(/[1-8]/.test(ch)) f+=Number(ch);
   else if(validPieces.includes(ch)){if(f>=8) throw new Error('Invalid FEN: rank overflow'); const color=ch===ch.toUpperCase()?'w':'b'; board[sq(f,7-ri)]={color,type:ch.toLowerCase() as Piece['type']}; f++;}
   else throw new Error('Invalid FEN: invalid piece symbol');
  }
  if(f!==8) throw new Error('Invalid FEN: rank does not contain 8 files');
 });
 if(turn!=='w'&&turn!=='b') throw new Error('Invalid FEN: active color');
 if(!/^(-|K?Q?k?q?)$/.test(rights)) throw new Error('Invalid FEN: castling rights');
 if(!/^(-|[a-h][36])$/.test(ep)) throw new Error('Invalid FEN: en-passant square');
 if(!/^\d+$/.test(half)||!/^\d+$/.test(full)||Number(half)<0||Number(full)<1) throw new Error('Invalid FEN: move counters');
 const wk=board.findIndex(x=>x?.color==='w'&&x.type==='k'), bk=board.findIndex(x=>x?.color==='b'&&x.type==='k');
 if(wk<0||bk<0||board.filter(x=>x?.color==='w'&&x.type==='k').length!==1||board.filter(x=>x?.color==='b'&&x.type==='k').length!==1) throw new Error('Invalid FEN: exactly one King per side required');
 for(let i=0;i<64;i++){if((i>>3)===0||(i>>3)===7){const pc=board[i];if(pc?.type==='p')throw new Error('Invalid FEN: Pawn on first/eighth rank');}}
 const castling={wK:rights.includes('K'),wQ:rights.includes('Q'),bK:rights.includes('k'),bQ:rights.includes('q')};
 if(castling.wK&&(wk!==4||board[7]?.color!=='w'||board[7]?.type!=='r')||castling.wQ&&(wk!==4||board[0]?.color!=='w'||board[0]?.type!=='r')||castling.bK&&(bk!==60||board[63]?.color!=='b'||board[63]?.type!=='r')||castling.bQ&&(bk!==60||board[56]?.color!=='b'||board[56]?.type!=='r')) throw new Error('Invalid FEN: castling rights inconsistent with board');
 const epSquare=ep==='-'?null:parseSquare(ep);
 if(epSquare!==null){
  const expectedRank=turn==='w'?5:2;
  if(rankOf(epSquare)!==expectedRank||board[epSquare]!==null) throw new Error('Invalid FEN: en-passant square inconsistent');
  const pawnSquare=epSquare+(turn==='w'?-8:8);
  if(board[pawnSquare]?.color!==(turn==='w'?'b':'w')||board[pawnSquare]?.type!=='p') throw new Error('Invalid FEN: missing pawn for en-passant');
 }
 if(Math.abs(fileOf(wk)-fileOf(bk))<=1&&Math.abs(rankOf(wk)-rankOf(bk))<=1) throw new Error('Invalid FEN: Kings may not be adjacent');
 return {board,turn,castling,ep:epSquare,halfmove:Number(half),fullmove:Number(full)};
}
export function toFEN(p:Position){let rows:string[]=[];for(let r=7;r>=0;r--){let n=0,row='';for(let f=0;f<8;f++){const pc=p.board[sq(f,r)];if(!pc)n++;else{if(n){row+=n;n=0}row+=pc.color==='w'?pc.type.toUpperCase():pc.type}}if(n)row+=n;rows.push(row)} const rights=(p.castling.wK?'K':'')+(p.castling.wQ?'Q':'')+(p.castling.bK?'k':'')+(p.castling.bQ?'q':''); return `${rows.join('/')} ${p.turn} ${rights||'-'} ${p.ep===null?'-':squareName(p.ep)} ${p.halfmove} ${p.fullmove}`;}
export function positionKey(p:Position){let ep=p.ep===null?'-':squareName(p.ep);if(p.ep!==null){const f=fileOf(p.ep),r=rankOf(p.ep);const pawnRank=r+(p.turn==='w'?-1:1);const hasCapturer=[f-1,f+1].some(x=>x>=0&&x<8&&p.board[sq(x,pawnRank)]?.color===p.turn&&p.board[sq(x,pawnRank)]?.type==='p');const capSquare=p.ep+(p.turn==='w'?-8:8);if(!hasCapturer||p.board[capSquare]?.type!=='p'||p.board[capSquare]?.color===p.turn)ep='-';}return toFEN({...p,halfmove:0,fullmove:1,ep:ep==='-'?null:p.ep}).split(' ').slice(0,4).join(' ');}
