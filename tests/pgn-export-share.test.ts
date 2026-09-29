import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';

describe('PGN export contract',()=>{
 it('exports metadata, moves, and result for sharing',()=>{
  const game=new ChessGame();
  game.play({from:12,to:28});
  game.play({from:52,to:36});
  const pgn=game.pgn({Event:'Yasin Chess',Site:'Local',Date:'2026.09.29'});
  expect(pgn).toContain('[Event "Yasin Chess"]');
  expect(pgn).toContain('[Site "Local"]');
  expect(pgn).toContain('1. e4 e5 *');
 });
 it('exports a result token even for an active game',()=>expect(new ChessGame().pgn({Event:'Yasin Chess'})).toContain('*'));
});
