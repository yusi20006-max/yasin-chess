import {describe,expect,it} from 'vitest';
import {fromFEN,toFEN} from '../src/core/board';

describe('FEN round-trip audit',()=>{
  it.each([
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
    'r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 17 42',
    '7k/8/8/8/8/8/2B5/2K5 w - - 73 19',
  ])('preserves supported position exactly: %s',(fen)=>{
    expect(toFEN(fromFEN(fen))).toBe(fen);
  });

  it('rejects malformed and impossible FEN without partial state',()=>{
    expect(()=>fromFEN('8/8/8/8/8/8/8/8 w - - 0 1')).toThrow(/King/);
    expect(()=>fromFEN('8/8/8/8/8/8/8/K6k w - - 0 1')).toThrow(/adjacent/);
    expect(()=>fromFEN('8/8/8/8/8/8/P7/K6k w - - 0 1')).toThrow();
  });
});
