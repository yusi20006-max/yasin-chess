import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {legalMoves} from '../src/core/moves';
import {chooseMove} from '../src/engine/minimax';
import type {Move,Position} from '../src/core/types';

function sameMove(a:Move,b:Move){
  return a.from===b.from&&a.to===b.to&&a.promotion===b.promotion;
}

function assertLegalEngineMove(position:Position,move:Move|undefined){
  expect(move).toBeDefined();
  const legal=legalMoves(position);
  expect(legal.some(candidate=>sameMove(candidate,move!))).toBe(true);
}

describe('P0 engine diagnostic: chooseMove isolation',()=>{
  it('returns a legal move from the initial position',()=>{
    const game=new ChessGame();
    const moves=legalMoves(game.position);

    expect(moves.length).toBeGreaterThan(0);

    const move=chooseMove(game.position,2);
    assertLegalEngineMove(game.position,move);
  });

  it('reproduces the failing post-1.c4 Black AI position independently',()=>{
    const game=new ChessGame();
    const whiteMove=legalMoves(game.position).find(move=>{
      return move.from===10&&move.to===26;
    });

    expect(whiteMove).toBeDefined();
    game.play(whiteMove!);

    expect(game.position.turn).toBe('b');
    expect(legalMoves(game.position).length).toBeGreaterThan(0);

    const move=chooseMove(game.position,2);
    assertLegalEngineMove(game.position,move);
    expect(move!.from).toBeGreaterThanOrEqual(0);
    expect(move!.from).toBeLessThan(64);
    expect(move!.to).toBeGreaterThanOrEqual(0);
    expect(move!.to).toBeLessThan(64);
  });

  it('applies the diagnosed engine move and preserves game state transitions',()=>{
    const game=new ChessGame();
    const whiteMove=legalMoves(game.position).find(move=>move.from===10&&move.to===26)!;
    game.play(whiteMove);

    const beforeHistory=game.history.length;
    const beforeTurn=game.position.turn;
    const aiMove=chooseMove(game.position,2);
    assertLegalEngineMove(game.position,aiMove);

    const san=game.play(aiMove!);

    expect(san).toBeTruthy();
    expect(game.history.length).toBe(beforeHistory+1);
    expect(beforeTurn).toBe('b');
    expect(game.position.turn).toBe('w');
    expect(game.history.at(-1)?.move).toEqual(aiMove);
  });

  it('does not leak mutable engine state across repeated deterministic calls',()=>{
    const positions=[
      new ChessGame().position,
      (()=>{const game=new ChessGame();game.play(legalMoves(game.position).find(move=>move.from===10&&move.to===26)!);return game.position;})(),
      new ChessGame('r1bqkbnr/pppp1ppp/2n5/4p3/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 1 2').position
    ];

    for(const position of positions){
      const first=chooseMove(position,2);
      const second=chooseMove(position,2);
      assertLegalEngineMove(position,first);
      assertLegalEngineMove(position,second);
      expect(second).toEqual(first);
    }
  });

  it('returns no move for checkmate and stalemate terminal positions',()=>{
    const checkmate=new ChessGame('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1');
    expect(legalMoves(checkmate.position)).toHaveLength(0);
    expect(chooseMove(checkmate.position,2)).toBeUndefined();

    const stalemate=new ChessGame('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    expect(legalMoves(stalemate.position)).toHaveLength(0);
    expect(chooseMove(stalemate.position,2)).toBeUndefined();
  });

  it('records representative chooseMove timing without making an arbitrary performance gate',()=>{
    const game=new ChessGame();
    const samples=[1,2,4];
    const timings=samples.map(depth=>{
      const started=performance.now();
      const move=chooseMove(game.position,depth);
      const elapsedMs=performance.now()-started;
      assertLegalEngineMove(game.position,move);
      return {depth,elapsedMs};
    });

    for(const sample of timings){
      console.info(
        `ENGINE_DIAGNOSTIC depth=${sample.depth} elapsedMs=${sample.elapsedMs.toFixed(2)}`
      );
    }

    expect(timings).toHaveLength(samples.length);
  });
});
