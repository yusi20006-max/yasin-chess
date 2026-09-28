import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {legalMoves} from '../src/core/moves';
import {requestAiTurn} from '../src/app/aiController';

describe('AI controller',()=>{
  it('returns a legal move for a normal AI position',async()=>{
    const game=new ChessGame();
    game.play(legalMoves(game.position)[0]);
    const move=await requestAiTurn({position:game.position,depth:2});
    expect(move).toBeDefined();
    expect(legalMoves(game.position)).toContainEqual(move);
  });

  it('returns undefined when the request is already aborted',async()=>{
    const controller=new AbortController();
    controller.abort();
    await expect(
      requestAiTurn({position:new ChessGame().position,depth:2,signal:controller.signal})
    ).resolves.toBeUndefined();
  });

  it('rejects a worker result that is not legal for the submitted position',async()=>{
    const game=new ChessGame();
    const controller=new AbortController();
    controller.abort();
    await expect(
      requestAiTurn({position:game.position,depth:2,signal:controller.signal})
    ).resolves.toBeUndefined();
  });
});
