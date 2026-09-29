import 'fake-indexeddb/auto';
import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {resumeActiveGame,saveActiveGame,clearActiveGame} from '../src/storage/activeGame';

describe('automatic active-game persistence contract',()=>{
  it('persists a changed game state and restores it',async()=>{
    await clearActiveGame();
    const game=new ChessGame();
    await saveActiveGame(game);
    const move=legalMoves(game.position)[0];
    game.play(move);
    await saveActiveGame(game);
    const restored=await resumeActiveGame();
    expect(restored?.history.length).toBe(1);
    expect(restored?.position).toEqual(game.position);
    await clearActiveGame();
  });
});
