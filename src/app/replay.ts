import {ChessGame} from '../core/game';
import type {Position} from '../core/types';
export class GameReplay{
 private readonly positions:Position[]; private cursor=0;
 constructor(game:ChessGame){const start=game.history.length?game.history[0].before:game.position;this.positions=[{...start,board:[...start.board],castling:{...start.castling}},...game.history.map(h=>({...h.after,board:[...h.after.board],castling:{...h.after.castling}}))]}
 get index(){return this.cursor} get length(){return this.positions.length-1}
 get position():Position{const p=this.positions[this.cursor];return {...p,board:[...p.board],castling:{...p.castling}}}
 first(){this.cursor=0;return this.position} last(){this.cursor=this.length;return this.position}
 next(){if(this.cursor<this.length)this.cursor++;return this.position} previous(){if(this.cursor>0)this.cursor--;return this.position}
 goTo(index:number){this.cursor=Math.min(this.length,Math.max(0,Math.floor(index)));return this.position}
}
