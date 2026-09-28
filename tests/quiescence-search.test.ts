import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {legalMoves} from '../src/core/moves';
import {searchBestMove} from '../src/engine/minimax';
describe('quiescence search',()=>{
 it('keeps tactical positions legal under bounded extension',()=>{
  const game=new ChessGame('4k3/8/8/3q4/3Q4/8/4K3/8 w - - 0 1');
  const result=searchBestMove(game.position,3,{timeBudgetMs:500});
  expect(result.move).toBeDefined();
  expect(legalMoves(game.position)).toContainEqual(result.move);
  expect(result.nodes).toBeGreaterThan(0);
 });
 it('respects the search budget while extending tactical lines',()=>{
  const game=new ChessGame('r3k2r/ppp2ppp/2n1bn2/8/2B1P3/2N1BN2/PPP2PPP/R3K2R w KQkq - 0 1');
  const result=searchBestMove(game.position,8,{timeBudgetMs:10});
  expect(result.move).toBeDefined();
  expect(result.nodes).toBeGreaterThan(0);
 });
});
