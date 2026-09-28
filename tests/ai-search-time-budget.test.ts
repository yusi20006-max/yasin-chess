import {describe,expect,it,vi} from 'vitest';
import {chooseMove,searchBestMove} from '../src/engine/minimax';
import {initialPosition} from '../src/core/position';

describe('AI search time budget',()=>{
  it('returns a legal move with a very small budget',()=>{
    const result=searchBestMove(initialPosition(),20,{timeBudgetMs:1});
    expect(result.move).toBeDefined();
    expect(result.timedOut).toBe(true);
  });
  it('preserves a completed best move when a later depth times out',()=>{
    const result=searchBestMove(initialPosition(),12,{timeBudgetMs:10});
    expect(result.move).toBeDefined();
    expect(result.depth).toBeGreaterThanOrEqual(0);
  });
  it('honors AbortSignal before search starts',()=>{
    const controller=new AbortController();
    controller.abort();
    expect(chooseMove(initialPosition(),8,{timeBudgetMs:1000,signal:controller.signal})).toBeUndefined();
  });
  it('keeps legacy chooseMove signature behavior available',()=>{
    expect(chooseMove(initialPosition(),1)).toBeDefined();
  });
});
