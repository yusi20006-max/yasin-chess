export type Color = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Piece = { color: Color; type: PieceType };
export type Square = number; // 0=a1 ... 63=h8
export type Promotion = Exclude<PieceType, 'p' | 'k'>;
export type Move = { from: Square; to: Square; promotion?: Promotion; isCastle?: boolean; isEnPassant?: boolean };
export type CastlingRights = { wK: boolean; wQ: boolean; bK: boolean; bQ: boolean };
export type Position = {
  board: (Piece | null)[];
  turn: Color;
  castling: CastlingRights;
  ep: Square | null;
  halfmove: number;
  fullmove: number;
};
export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw-repetition' | 'draw-50-move' | 'draw-insufficient' | 'draw-agreement';
