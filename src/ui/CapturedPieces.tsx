import type {Move, Piece as PieceType} from '../core/types';
import Piece from './Piece';

type HistoryEntry={move:Move;before:{board:(PieceType|null)[]}};
type Props={history:HistoryEntry[];capturedColor:'w'|'b';playerColor?:'w'|'b'};

const VALUE:Record<PieceType['type'],number>={p:1,n:3,b:3,r:5,q:9,k:0};

function capturedSquare(move:Move):number|null{
  if(move.isEnPassant)return move.to+(move.to<16?8:-8);
  return move.to;
}

export default function CapturedPieces({history,capturedColor,playerColor}:Props){
  const captured=history.flatMap(h=>{
    const square=capturedSquare(h.move);
    const piece=square===null?null:h.before.board[square];
    return piece&&piece.color===capturedColor?[piece]:[];
  });
  const material=captured.reduce((sum,p)=>sum+VALUE[p.type],0);
  const playerMaterial=playerColor?history.reduce((sum,h)=>{const square=capturedSquare(h.move);const piece=square===null?null:h.before.board[square];return sum+(piece&&piece.color!==playerColor?VALUE[piece.type]:0)},0):material;
  const opponentMaterial=playerColor?history.reduce((sum,h)=>{const square=capturedSquare(h.move);const piece=square===null?null:h.before.board[square];return sum+(piece&&piece.color===playerColor?VALUE[piece.type]:0)},0):0;
  const advantage=playerColor?Math.max(0,playerMaterial-opponentMaterial):0;
  if(!captured.length)return <div className="captured-pieces" aria-label="No captured pieces"><span className="captured-empty">—</span></div>;
  return <div className="captured-pieces" aria-label={`Captured ${capturedColor==='w'?'white':'black'} pieces`}>
    <div className="captured-list">{captured.map((piece,i)=><span className="captured-piece" key={`${piece.color}${piece.type}-${i}`}><Piece piece={piece}/></span>)}</div>
    <span className="material-count" aria-label={`Captured material ${material}`}>+{material}</span>{advantage>0&&<span className="material-advantage" aria-label={`Material advantage ${advantage}`}>+{advantage}</span>}
  </div>;
}
