import type {Piece as PieceType} from '../core/types';

/** Unicode chess piece glyphs (Phase 4 / #38 SVG-ready piece rendering system). */
export const UNICODE_PIECES: Record<string, string> = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};

export type PieceSetId = 'unicode' | 'classic';

export function pieceGlyph(piece: PieceType, set: PieceSetId = 'unicode'): string {
  const key = piece.color + piece.type;
  return UNICODE_PIECES[key] ?? '?';
}

export function pieceAriaLabel(piece: PieceType): string {
  const color = piece.color === 'w' ? 'white' : 'black';
  const names: Record<string, string> = {
    k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn',
  };
  return `${color} ${names[piece.type] ?? piece.type}`;
}
