import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {fromFEN} from '../src/core/board';

const move=(from:number,to:number)=>({from,to});

describe('draw rules audit',()=>{
  it('detects threefold repetition from position identity',()=>{
    const g=new ChessGame();
    g.play(move(6,21)); // Ng1-f3
    g.play(move(62,45)); // Ng8-f6
    g.play(move(21,6)); // Nf3-g1
    g.play(move(45,62)); // Nf6-g8
    g.play(move(6,21));
    g.play(move(62,45));
    g.play(move(21,6));
    g.play(move(45,62));
    expect(g.status()).toBe('draw-repetition');
  });

  it('distinguishes a fifty-move claim from automatic seventy-five-move draw',()=>{
    const claim=new ChessGame('8/8/8/8/8/8/R6k/K7 w - - 100 51');
    expect(claim.canClaimFiftyMove()).toBe(true);
    expect(claim.status()).toBe('claim-50-move');

    const automatic=new ChessGame('8/8/8/8/8/8/R6k/K7 w - - 150 76');
    expect(automatic.status()).toBe('draw-75-move');
  });

  it('keeps insufficient-material detection independent of move counters',()=>{
    const g=new ChessGame('8/8/8/8/8/8/R6k/K7 w - - 0 1');
    expect(g.status()).toBe('draw-insufficient');
    expect(g.resultToken()).toBe('1/2-1/2');
  });

  it('records an explicit draw agreement',()=>{
    const g=new ChessGame();
    expect(g.acceptDrawAgreement()).toBe(true);
    expect(g.status()).toBe('draw-agreement');
    expect(g.resultToken()).toBe('1/2-1/2');
  });
});
