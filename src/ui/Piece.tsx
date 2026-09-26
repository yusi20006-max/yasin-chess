import type {Piece as PieceType} from '../core/types';

const glyphs:Record<string,string>={wk:'♔',wq:'♕',wr:'♖',wb:'♗',wn:'♘',wp:'♙',bk:'♚',bq:'♛',br:'♜',bb:'♝',bn:'♞',bp:'♟'};

export default function Piece({piece}:{piece:PieceType}){
  const key=piece.color+piece.type;
  return <span className={`piece piece-${piece.color}`} role="img" aria-label={`${piece.color==='w'?'white':'black'} ${piece.type}`}>{glyphs[key]}</span>;
}
