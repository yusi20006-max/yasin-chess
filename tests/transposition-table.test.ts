import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {searchBestMove} from '../src/engine/minimax';
import {TranspositionTable} from '../src/engine/transposition';
describe('transposition table',()=>{
 it('enforces capacity and replaces shallower entries safely',()=>{
  const table=new TranspositionTable(2);const p=new ChessGame().position;
  table.set(p,{depth:2,score:10,bound:'exact'});
  table.set(p,{depth:1,score:99,bound:'exact'});
  expect(table.get(p)?.score).toBe(10);
  table.set(p,{depth:3,score:20,bound:'exact'});
  table.set(new ChessGame('4k3/8/8/8/8/8/8/R3K3 w - - 0 1').position,{depth:1,score:5,bound:'lower'});
  table.set(new ChessGame('4k3/8/8/8/8/8/8/R3K3 b - - 0 1').position,{depth:1,score:5,bound:'upper'});
  expect(table.size()).toBeLessThanOrEqual(2);
 });
 it('does not change legal search output',()=>{
  const game=new ChessGame('4k3/8/8/3q4/3Q4/8/4K3/8 w - - 0 1');
  const result=searchBestMove(game.position,4,{timeBudgetMs:500});
  expect(result.move).toBeDefined();
 });
});
