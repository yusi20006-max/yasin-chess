import {describe,expect,it} from 'vitest';import {ChessGame} from '../src/core/game';import {fromFEN,toFEN} from '../src/core/board';import {legalMoves} from '../src/core/moves';
describe('Yasin Chess core',()=>{
it('starts with 20 legal moves',()=>expect(new ChessGame().moves()).toHaveLength(20));
it('supports castling',()=>{const g=new ChessGame('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');expect(g.moves().filter(m=>m.isCastle)).toHaveLength(2);});
it('requires the correct rooks for castling',()=>{const g=new ChessGame('4k3/8/8/8/8/8/8/4K3 w KQ - 0 1');expect(g.moves().filter(m=>m.isCastle)).toHaveLength(0);});
it('requires the king on its home square for castling',()=>{const g=new ChessGame('4k3/8/8/8/8/8/R6R/8 w KQ - 0 1');expect(g.moves().filter(m=>m.isCastle)).toHaveLength(0);});
it('supports en passant',()=>{const g=new ChessGame();g.play(g.moves().find(m=>m.from===12&&m.to===28)!);g.play(g.moves().find(m=>m.from===48&&m.to===40)!);g.play(g.moves().find(m=>m.from===28&&m.to===36)!);g.play(g.moves().find(m=>m.from===51&&m.to===35)!);const ep=g.moves().find(m=>m.isEnPassant);expect(ep).toBeTruthy();});
it('exports correct PGN checkmate result',()=>{const g=new ChessGame('7k/5Q2/7K/8/8/8/8/8 b - - 0 1');expect(g.pgn()).toBe('1-0');});
it('exports FEN and Result tags',()=>{const fen='4k3/8/8/8/8/8/4K3/8 w - - 0 1';const g=new ChessGame(fen);const p=g.pgn({Event:'Test'});expect(p).toContain('[SetUp "1"]');expect(p).toContain('[FEN "'+fen+'"]');expect(p).toContain('[Result "*"]');});
it('detects checkmate',()=>{const g=new ChessGame('7k/5Q2/7K/8/8/8/8/8 b - - 0 1');expect(g.status()).toBe('checkmate');});
it('detects stalemate',()=>{const g=new ChessGame('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');expect(g.status()).toBe('stalemate');});
it('generates SAN history',()=>{const g=new ChessGame();g.play(g.moves().find(m=>m.from===12&&m.to===28)!);expect(g.pgn()).toBe('1. e4 *');});
it('never generates a move that captures the opposing king',()=>{const p=fromFEN('4k3/8/8/8/8/8/4R3/4K3 w - - 0 1');expect(legalMoves(p).some(m=>m.to===60)).toBe(false);});
it('rejects adjacent kings from legal captures',()=>{const p=fromFEN('8/8/8/8/8/8/4k2K/8 w - - 0 1');expect(legalMoves(p).some(m=>m.to===4)).toBe(false);});
it('rejects malformed FEN',()=>{expect(()=>fromFEN('8/8/8/8/8/8/4K3/4k3 w - -')).toThrow();});
it('rejects adjacent kings in FEN',()=>{expect(()=>fromFEN('8/8/8/8/8/8/4K2k/8 w - - 0 1')).toThrow();});
it('round-trips valid FEN',()=>{const fen='r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1';expect(toFEN(fromFEN(fen))).toBe(fen);});
});
