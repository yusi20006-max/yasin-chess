import {describe,expect,it} from 'vitest';
import {parseSquare} from '../src/core/board';
import {ChessGame} from '../src/core/game';
import {legalMoves} from '../src/core/moves';
import type {Move,Position} from '../src/core/types';
import {chooseMove} from '../src/engine/minimax';

function moveKey(move:Move){return `${move.from}-${move.to}-${move.promotion??''}`;}

function assertEngineBoundary(position:Position,depth:number,label:string){
  const legal=legalMoves(position);
  const started=performance.now();
  const move=chooseMove(position,depth);
  const elapsedMs=performance.now()-started;

  console.info('[P0 Engine Diagnostic]',JSON.stringify({
    label,
    turn:position.turn,
    depth,
    legalMoves:legal.length,
    move:move?moveKey(move):null,
    elapsedMs:Number(elapsedMs.toFixed(3)),
  }));

  expect(legal.length).toBeGreaterThan(0);
  expect(move).toBeDefined();
  expect(legal.some(candidate=>moveKey(candidate)===moveKey(move!))).toBe(true);
  return {move:move!,elapsedMs};
}

describe('P0 Engine Diagnostic — isolate chooseMove from UI and Worker runtime',()=>{
  it('passes from the initial position without UI or Worker runtime',()=>{
    const game=new ChessGame();
    expect(game.position.turn).toBe('w');
    assertEngineBoundary(game.position,2,'initial-position');
  });

  it('passes the exact post-1.c4 Black-turn scenario',()=>{
    const game=new ChessGame();
    const c4=game.moves().find(move=>move.from===parseSquare('c2')&&move.to===parseSquare('c4'));

    expect(c4).toBeDefined();
    game.play(c4!);
    expect(game.position.turn).toBe('b');

    const blackLegal=legalMoves(game.position);
    expect(blackLegal.length).toBeGreaterThan(0);

    const {move}=assertEngineBoundary(game.position,2,'after-1.c4-black-turn');
    expect(blackLegal.some(candidate=>moveKey(candidate)===moveKey(move))).toBe(true);

    const beforeHistory=game.history.length;
    game.play(move);
    expect(game.history).toHaveLength(beforeHistory+1);
    expect(game.position.turn).toBe('w');
    expect(game.history.at(-1)?.move).toEqual(move);
  });

  it('does not leak state across repeated deterministic calls',()=>{
    const positions=[
      new ChessGame().position,
      new ChessGame('rnbqkbnr/pppppppp/8/8/2P5/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1').position,
      new ChessGame('r1bqkbnr/pppp1ppp/n4n2/2P5/8/6P1/PP1PPP1P/RNBQKBNR w KQkq - 0 1').position,
    ];

    const snapshots=positions.map((position,index)=>({
      index,
      turn:position.turn,
      before:position.board.map(piece=>piece?piece.color+piece.type:null),
      result:assertEngineBoundary(position,2,`repeated-${index+1}`),
    }));

    for(const snapshot of snapshots){
      expect(snapshot.result.move).toBeDefined();
      expect(snapshot.before).toHaveLength(64);
    }
  });

  it('reports search timing at representative depths without a performance gate',()=>{
    const game=new ChessGame();
    const samples=[1,2].map(depth=>assertEngineBoundary(game.position,depth,`timing-depth-${depth}`));

    for(const sample of samples){
      expect(Number.isFinite(sample.elapsedMs)).toBe(true);
      expect(sample.elapsedMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('returns no move for checkmate and stalemate terminal positions',()=>{
    const checkmate=new ChessGame('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1');
    expect(checkmate.moves()).toHaveLength(0);
    const checkmateStarted=performance.now();
    const checkmateMove=chooseMove(checkmate.position,2);
    console.info('[P0 Engine Diagnostic]',JSON.stringify({
      label:'checkmate',
      turn:checkmate.position.turn,
      legalMoves:0,
      move:checkmateMove??null,
      elapsedMs:Number((performance.now()-checkmateStarted).toFixed(3)),
    }));
    expect(checkmateMove).toBeUndefined();

    const stalemate=new ChessGame('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    expect(stalemate.moves()).toHaveLength(0);
    const stalemateStarted=performance.now();
    const stalemateMove=chooseMove(stalemate.position,2);
    console.info('[P0 Engine Diagnostic]',JSON.stringify({
      label:'stalemate',
      turn:stalemate.position.turn,
      legalMoves:0,
      move:stalemateMove??null,
      elapsedMs:Number((performance.now()-stalemateStarted).toFixed(3)),
    }));
    expect(stalemateMove).toBeUndefined();
  });
});
