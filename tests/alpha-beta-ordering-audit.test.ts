import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {legalMoves} from '../src/core/moves';
import {searchBestMove} from '../src/engine/minimax';

describe('alpha-beta and move ordering audit',()=>{
 it('returns a legal tactical move and records searched nodes',()=>{
  const game=new ChessGame('4k3/8/8/3q4/3Q4/8/4K3/8 w - - 0 1');
  const result=searchBestMove(game.position,4,{timeBudgetMs:1000});
  expect(result.move).toBeDefined();
  expect(legalMoves(game.position)).toContainEqual(result.move);
  expect(result.nodes).toBeGreaterThan(0);
 });
 it('preserves legal-move semantics across search depths',()=>{
  const game=new ChessGame('r3k2r/ppp2ppp/2n1bn2/8/2B1P3/2N1BN2/PPP2PPP/R3K2R w KQkq - 0 1');
  const shallow=searchBestMove(game.position,1,{timeBudgetMs:500});
  const deeper=searchBestMove(game.position,3,{timeBudgetMs:500});
  expect(legalMoves(game.position)).toContainEqual(shallow.move);
  expect(legalMoves(game.position)).toContainEqual(deeper.move);
 });
});
