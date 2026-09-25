import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
describe('offline runtime contract',()=>{
 it('starts and plays without network dependencies',()=>{
  const game=new ChessGame(); const move=game.moves().find(m=>m.from===12&&m.to===28);
  expect(move).toBeTruthy(); game.play(move!); expect(game.history[0].san).toBe('e4');
 });
 it('keeps state isolated between game instances',()=>{
  const game=new ChessGame(); game.play(game.moves().find(m=>m.from===12&&m.to===28)!);
  const clone=game.clone(); clone.undo(); expect(game.history).toHaveLength(1); expect(clone.history).toHaveLength(0);
 });
});
