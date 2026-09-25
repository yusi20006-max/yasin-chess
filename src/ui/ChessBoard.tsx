import type {ReactNode} from 'react';
import type {Position,Square} from '../core/types';
import {squareName} from '../core/board';
type Props={position:Position;selected:Square|null;highlights:Set<Square>;onSquareClick:(square:Square)=>void;onSquareDrag?:(from:Square,to:Square)=>void;renderPiece:(square:Square)=>ReactNode;orientation?:'white'|'black';lastMove?:{from:Square;to:Square};checkSquare?:Square|null};
export default function ChessBoard({position,selected,highlights,onSquareClick,onSquareDrag,renderPiece,orientation='white',lastMove,checkSquare}:Props){
 const ranks=orientation==='white'?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];
 const files=orientation==='white'?[0,1,2,3,4,5,6,7]:[7,6,5,4,3,2,1,0];
 return <div className="chess-board" role="grid" aria-label="Chess board">{ranks.flatMap(rank=>files.map(file=>{const s=rank*8+file;return <button type="button" draggable={Boolean(position.board[s])} onDragStart={e=>e.dataTransfer.setData('text/plain',String(s))} onDragOver={e=>{if(highlights.has(s))e.preventDefault()}} onDrop={e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(from))onSquareDrag?.(from,s)}} role="gridcell" aria-label={squareName(s)} key={s} className={`square ${(rank+file)%2?'dark':'light'} ${selected===s?'selected':''} ${highlights.has(s)?'hint':''} ${lastMove?.from===s||lastMove?.to===s?'last-move':''} ${checkSquare===s?'in-check':''}`} onClick={()=>onSquareClick(s)}>{renderPiece(s)}</button>}))}</div>;
}
