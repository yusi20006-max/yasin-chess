import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {toSAN} from '../src/core/san';
import {fromFEN} from '../src/core/board';

describe('PGN/SAN audit',()=>{
  it('generates SAN for ordinary moves and captures',()=>{
    const g=new ChessGame();
    expect(g.play({from:12,to:28})).toBe('e4');
    expect(g.play({from:51,to:35})).toBe('d5');
    expect(g.play({from:28,to:35})).toBe('exd5');
  });

  it('uses standard castling SAN',()=>{
    const p=fromFEN('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    expect(toSAN(p,{from:4,to:6,isCastle:true})).toBe('O-O');
    expect(toSAN(p,{from:4,to:2,isCastle:true})).toBe('O-O-O');
  });

  it('includes promotion notation',()=>{
    const p=fromFEN('7k/P7/8/8/8/8/8/2K5 w - - 0 1');
    expect(toSAN(p,{from:48,to:56,promotion:'q'})).toBe('a8=Q+');
  });

  it('exports FEN-start metadata even without caller-supplied headers',()=>{
    const g=new ChessGame('7k/8/8/8/8/8/R7/K7 w - - 0 1');
    const pgn=g.pgn({Event:'FEN Audit'});
    expect(pgn).toContain('[SetUp "1"]');
    expect(pgn).toContain('[FEN "7k/8/8/8/8/8/R7/K7 w - - 0 1"]');
    expect(pgn).toContain('[Result "*"]');
  });
});
