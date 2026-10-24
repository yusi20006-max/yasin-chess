import {describe,expect,it,vi} from 'vitest';
import {ChessGame} from '../src/core/game';
import {legalMoves} from '../src/core/moves';
import {requestAiTurn} from '../src/app/aiController';
import * as aiWorker from '../src/engine/aiWorker';
import type {Move} from '../src/core/types';

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

  it('discards a late worker response when the request is aborted in flight',async()=>{
    const game=new ChessGame();
    const controller=new AbortController();
    let resolveMove:(move:Move|undefined)=>void=()=>{};
    const pending=new Promise<Move|undefined>(resolve=>{resolveMove=resolve});
    const spy=vi.spyOn(aiWorker,'requestAiMove').mockReturnValue(pending);
    try{
      const result=requestAiTurn({position:game.position,depth:2,signal:controller.signal});
      controller.abort();
      resolveMove(legalMoves(game.position)[0]);
      await expect(result).resolves.toBeUndefined();
    }finally{spy.mockRestore()}
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
