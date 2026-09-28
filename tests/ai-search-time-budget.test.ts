import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {chooseMove,searchBestMove} from '../src/engine/minimax';

describe('AI search time budget',()=>{
  it('returns a legal move with a very small budget',()=>{
    const game=new ChessGame();
    const result=searchBestMove(game.position,20,{timeBudgetMs:1});
    expect(result.move).toBeDefined();
    expect(result.timedOut).toBe(true);
  });
  it('preserves a completed best move when a later depth times out',()=>{
    const game=new ChessGame('r2q1rk1/ppp1bppp/2np1n2/8/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1');
    const result=searchBestMove(game.position,12,{timeBudgetMs:10});
    expect(result.move).toBeDefined();
    expect(result.depth).toBeGreaterThanOrEqual(0);
  });
  it('honors AbortSignal before search starts',()=>{
    const controller=new AbortController();
    controller.abort();
    expect(chooseMove(new ChessGame('r2q1rk1/ppp1bppp/2np1n2/8/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1').position,8,{timeBudgetMs:1000,signal:controller.signal})).toBeUndefined();
  });
  it('keeps legacy chooseMove signature behavior available',()=>{
    expect(chooseMove(new ChessGame().position,1)).toBeDefined();
  });
});
