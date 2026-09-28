import {fileOf,rankOf,sq,other} from '../core/board';
import {legalMoves} from '../core/moves';
import {PIECE_VALUE} from '../core/constants';
import type {Color,Position} from '../core/types';

const PST:Record<'p'|'n'|'b'|'r'|'q',number[][]>={
p:[[0,0,0,0,0,0,0,0],[5,10,10,-20,-20,10,10,5],[5,-5,-10,0,0,-10,-5,5],[0,0,0,20,20,0,0,0],[5,5,10,25,25,10,5,5],[10,10,20,30,30,20,10,10],[50,50,50,50,50,50,50,50],[0,0,0,0,0,0,0,0]],
n:[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
b:[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
r:[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
q:[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]]
};

function attacks(p:Position,s:number):number[]{
 const pc=p.board[s];if(!pc)return[];const f=fileOf(s),r=rankOf(s),out:number[]=[];
 const push=(x:number,y:number)=>{if(x>=0&&x<8&&y>=0&&y<8)out.push(sq(x,y))};
 if(pc.type==='p'){const d=pc.color==='w'?1:-1;push(f-1,r+d);push(f+1,r+d)}
 else if(pc.type==='n'||pc.type==='k'){const d=pc.type==='n'?[[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]]:[[1,1],[1,0],[1,-1],[0,1],[0,-1],[-1,1],[-1,0],[-1,-1]];for(const [df,dr]of d)push(f+df,r+dr)}
 else{const d=pc.type==='r'?[[1,0],[-1,0],[0,1],[0,-1]]:pc.type==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];for(const[df,dr]of d){let x=f+df,y=r+dr;while(x>=0&&x<8&&y>=0&&y<8){const to=sq(x,y);out.push(to);if(p.board[to])break;x+=df;y+=dr}}}
 return out;
}
function mobility(p:Position,c:Color){let n=0;for(let s=0;s<64;s++)if(p.board[s]?.color===c)for(const to of attacks(p,s))if(!p.board[to]||p.board[to]?.color!==c)n++;return n}
function pawns(p:Position,c:Color){const own:number[]=[];const enemy:number[]=[];for(let s=0;s<64;s++)if(p.board[s]?.type==='p')(p.board[s]!.color===c?own:enemy).push(s);const files=Array(8).fill(0)as number[];for(const s of own)files[fileOf(s)]++;let score=0;for(let f=0;f<8;f++){if(files[f]>1)score-=12*(files[f]-1);if(files[f]===1&&(f===0?files[1]===0:f===7?files[6]===0:files[f-1]===0&&files[f+1]===0))score-=10}for(const s of own){const f=fileOf(s),r=rankOf(s);if(!enemy.some(e=>Math.abs(fileOf(e)-f)<=1&&(c==='w'?rankOf(e)>r:rankOf(e)<r)))score+=20+(c==='w'?r:7-r)*8}return score}
function kingSafety(p:Position,c:Color){const k=p.board.findIndex(x=>x?.color===c&&x.type==='k');if(k<0)return-1000;const f=fileOf(k),r=rankOf(k);let score=0;for(const df of[-1,0,1]){const x=f+df;if(x<0||x>7)continue;const y=c==='w'?r+1:r-1;score+=y>=0&&y<8&&p.board[sq(x,y)]?.color===c&&p.board[sq(x,y)]?.type==='p'?8:-8}for(let s=0;s<64;s++)if(p.board[s]?.color===other(c)&&attacks(p,s).some(to=>Math.max(Math.abs(fileOf(to)-f),Math.abs(rankOf(to)-r))<=1))score-=10;return score}

export function evaluatePosition(p:Position,currentLegalMoves?:number){
 let score=0;
 for(let s=0;s<64;s++){const x=p.board[s];if(!x)continue;const sign=x.color==='w'?1:-1;score+=sign*PIECE_VALUE[x.type];if(x.type!=='k'){const row=x.color==='w'?rankOf(s):7-rankOf(s);score+=sign*PST[x.type][row][fileOf(s)]}}
 score+=2*(mobility(p,'w')-mobility(p,'b'));
 const centers=[sq(3,3),sq(4,3),sq(3,4),sq(4,4)];score+=6*(centers.reduce((n,s)=>n+(Array.from({length:64},(_,i)=>p.board[i]?.color==='w'&&attacks(p,i).includes(s)?1:0)).reduce((a,b)=>a+b,0),0)-centers.reduce((n,s)=>n+(Array.from({length:64},(_,i)=>p.board[i]?.color==='b'&&attacks(p,i).includes(s)?1:0)).reduce((a,b)=>a+b,0),0));
 score+=pawns(p,'w')-pawns(p,'b');
 score+=(p.board.filter(x=>x?.color==='w'&&x.type==='b').length>=2?30:0)-(p.board.filter(x=>x?.color==='b'&&x.type==='b').length>=2?30:0);
 score+=kingSafety(p,'w')-kingSafety(p,'b');
 return score+(currentLegalMoves===undefined?0:2*(currentLegalMoves-legalMoves({...p,turn:other(p.turn)}).length))*(p.turn==='w'?1:-1);
}
