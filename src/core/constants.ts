import type { PieceType } from './types';
export const FILES='abcdefgh';
export const PIECE_VALUE: Record<PieceType, number>={p:100,n:320,b:330,r:500,q:900,k:20000};
export const START_FEN='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const SAN_PIECE: Record<PieceType,string>={p:'',n:'N',b:'B',r:'R',q:'Q',k:'K'};
