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
    expect(claim.resultToken()).toBe('*');
    expect(claim.pgn()).toBe('*');
    const accepted=claim.clone();
    expect(accepted.claimFiftyMoveDraw()).toBe(true);
    expect(accepted.status()).toBe('draw-agreement');
    expect(accepted.resultToken()).toBe('1/2-1/2');

    const automatic=new ChessGame('8/8/8/8/8/8/R6k/K7 w - - 150 76');
    expect(automatic.status()).toBe('draw-75-move');
  });

  it('records flag fall as a decisive result and preserves it when cloned',()=>{
    const g=new ChessGame();
    expect(g.flagFall('w')).toBe(true);
    expect(g.status()).toBe('timeout');
    expect(g.resultToken()).toBe('0-1');
    expect(g.clone().resultToken()).toBe('0-1');
    expect(()=>g.play(g.moves()[0])).toThrow('Game already terminated');
    expect(g.flagFall('b')).toBe(false);
  });

  it('rejects a fifty-move claim before one hundred half-moves',()=>{const g=new ChessGame('8/8/8/8/8/8/R6k/K7 w - - 99 50');expect(g.canClaimFiftyMove()).toBe(false);expect(g.status()).toBe('playing');expect(()=>g.claimFiftyMoveDraw()).toThrow('Fifty-move draw is not claimable');expect(g.resultToken()).toBe('*')});
  it('handles flag fall for either side and draws when mate is impossible',()=>{for(const loser of ['w','b'] as const){const g=new ChessGame();expect(g.flagFall(loser)).toBe(true);expect(g.resultToken()).toBe(loser==='w'?'0-1':'1-0');expect(g.clone().resultToken()).toBe(loser==='w'?'0-1':'1-0');expect(g.pgn({Event:'timeout'})).toContain(loser==='w'?'0-1':'1-0')}const impossibleMate=new ChessGame('7k/8/8/8/8/8/2B5/2K5 w - - 0 1');expect(impossibleMate.flagFall('w')).toBe(false);expect(impossibleMate.status()).toBe('draw-insufficient');expect(impossibleMate.resultToken()).toBe('1/2-1/2')});
  it('does not let timeout overwrite an already completed result',()=>{const mate=new ChessGame('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1');expect(mate.status()).toBe('checkmate');expect(mate.flagFall('b')).toBe(false);expect(mate.resultToken()).toBe('1-0');const stale=new ChessGame('8/8/8/8/8/8/2k5/2K5 w - - 150 76');expect(stale.status()).toBe('draw-75-move');expect(stale.flagFall('w')).toBe(false);expect(stale.resultToken()).toBe('1/2-1/2')});
  it('keeps insufficient-material detection independent of move counters',()=>{
    const g=new ChessGame('7k/8/8/8/8/8/2B5/2K5 w - - 0 1');
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
