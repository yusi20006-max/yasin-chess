import {describe,expect,it} from 'vitest';import {ChessGame} from '../src/core/game';import {fromFEN} from '../src/core/board';import {legalMoves} from '../src/core/moves';
describe('Yasin Chess core',()=>{
it('starts with 20 legal moves',()=>expect(new ChessGame().moves()).toHaveLength(20));
it('supports castling',()=>{const g=new ChessGame('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');expect(g.moves().filter(m=>m.isCastle)).toHaveLength(2);});
it('supports en passant',()=>{const g=new ChessGame();g.play(g.moves().find(m=>m.from===12&&m.to===28)!);g.play(g.moves().find(m=>m.from===48&&m.to===40)!);g.play(g.moves().find(m=>m.from===28&&m.to===36)!);g.play(g.moves().find(m=>m.from===51&&m.to===35)!);const ep=g.moves().find(m=>m.isEnPassant);expect(ep).toBeTruthy();});
it('detects checkmate',()=>{const g=new ChessGame('7k/5Q2/7K/8/8/8/8/8 b - - 0 1');expect(g.status()).toBe('checkmate');});
it('detects stalemate',()=>{const g=new ChessGame('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');expect(g.status()).toBe('stalemate');});
it('generates SAN history',()=>{const g=new ChessGame();g.play(g.moves().find(m=>m.from===12&&m.to===28)!);expect(g.pgn()).toBe('1. e4');});
it('loads FEN',()=>expect(legalMoves(fromFEN('8/8/8/8/8/8/4K3/4k3 w - - 0 1'))).toHaveLength(0));
});
