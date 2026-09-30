import type {Piece as PieceType} from '../core/types';
import {pieceGlyph, pieceAriaLabel, type PieceSetId} from './pieceSet';

type PieceProps = {
  piece: PieceType;
  set?: PieceSetId;
  animated?: boolean;
};

export default function Piece({piece, set = 'unicode', animated = true}: PieceProps) {
  return (
    <span
      className={`piece piece-${piece.color}${animated ? ' piece-animated' : ''}`}
      role="img"
      aria-label={pieceAriaLabel(piece)}
      data-piece={piece.color + piece.type}
    >
      {pieceGlyph(piece, set)}
    </span>
  );
}
