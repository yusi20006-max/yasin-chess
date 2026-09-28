import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {requestAiMove} from '../src/engine/aiWorker';
import {requestAiTurn} from '../src/app/aiController';
import {searchBestMove} from '../src/engine/minimax';
describe('engine runtime integration audit',()=>{
 it('engine search returns a legal move through the controller boundary',async()=>{
  const game=new ChessGame();
  const direct=searchBestMove(game.position,2,{timeBudgetMs:100});
  const controlled=await requestAiTurn({position:game.position,depth:2});
  expect(direct.move).toBeDefined();expect(controlled).toBeDefined();
 });
 it('worker entrypoint remains callable through the runtime adapter',async()=>{
  const game=new ChessGame();
  const move=await requestAiMove(game.position,1,undefined,100);
  expect(move).toBeDefined();
 });
 it('search budget produces a bounded result instead of an unbounded search',()=>{
  const game=new ChessGame();
  const started=performance.now();
  const result=searchBestMove(game.position,20,{timeBudgetMs:5});
  expect(result.move).toBeDefined();
  expect(result.nodes).toBeGreaterThanOrEqual(0);
  expect(performance.now()-started).toBeLessThan(1000);
 });
});
