import {fromFEN,initialPosition,positionKey} from './board';
import {applyMove,inCheck,isInsufficientMaterial,legalMoves} from './moves';
import {toSAN} from './san';
import type {GameStatus,Move,Position} from './types';
export class ChessGame{
 position:Position; history:{move:Move;san:string;before:Position;after:Position}[]=[]; future:{move:Move;san:string;before:Position;after:Position}[]=[]; keys:string[];
 constructor(fen?:string){this.position=fen?fromFEN(fen):initialPosition();this.keys=[positionKey(this.position)]}
 moves(){return legalMoves(this.position)}
 play(m:Move){if(!this.moves().some(x=>x.from===m.from&&x.to===m.to&&x.promotion===m.promotion))throw new Error('Illegal move');const san=toSAN(this.position,m),before=this.position,after=applyMove(this.position,m);this.history.push({move:m,san,before,after});this.future=[];this.position=after;this.keys.push(positionKey(after));return san}
 undo(){const h=this.history.pop();if(!h)return false;this.future.push(h);this.position=h.before;this.keys.pop();return true}
 redo(){const h=this.future.pop();if(!h)return false;this.history.push(h);this.position=h.after;this.keys.push(positionKey(h.after));return true}
 status():GameStatus{const ms=this.moves();if(ms.length===0)return inCheck(this.position,this.position.turn)?'checkmate':'stalemate';if(isInsufficientMaterial(this.position))return 'draw-insufficient';const count=this.keys.filter(k=>k===this.keys[this.keys.length-1]).length;if(count>=3)return 'draw-repetition';if(this.position.halfmove>=100)return 'draw-50-move';return inCheck(this.position,this.position.turn)?'check':'playing'}
 pgn(){let out='';for(let i=0;i<this.history.length;i++){if(i%2===0)out+=`${Math.floor(i/2)+1}. `;out+=this.history[i].san+' ';}const s=this.status();if(s==='checkmate')out+=(this.position.turn==='w'?'0-0-1':'1-0');return out.trim()}
}
