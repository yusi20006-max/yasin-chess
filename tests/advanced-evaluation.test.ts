import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {evaluatePosition} from '../src/engine/evaluation';

describe('advanced position evaluation',()=>{
  it('is deterministic for the same position',()=>{
    const position=new ChessGame('r2qk2r/ppp2ppp/2npbn2/8/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w kq - 0 1').position;
    expect(evaluatePosition(position)).toBe(evaluatePosition(position));
  });

  it('rewards bishop pair and passed pawns',()=>{
    const bishopPair=new ChessGame('4k3/8/8/8/3B4/8/4K3/2B5 w - - 0 1').position;
    const singleBishop=new ChessGame('4k3/8/8/8/3B4/8/4K3/8 w - - 0 1').position;
    const passedPawn=new ChessGame('4k3/8/8/4P3/8/8/8/4K3 w - - 0 1').position;
    const blockedPawn=new ChessGame('4k3/8/4p3/4P3/8/8/8/4K3 w - - 0 1').position;
    expect(evaluatePosition(bishopPair)).toBeGreaterThan(evaluatePosition(singleBishop));
    expect(evaluatePosition(passedPawn)).toBeGreaterThan(evaluatePosition(blockedPawn));
  });

  it('penalizes doubled and isolated pawn structure',()=>{
    const healthy=new ChessGame('4k3/8/8/8/3PP3/8/8/4K3 w - - 0 1').position;
    const doubled=new ChessGame('4k3/8/8/8/3P4/3P4/8/4K3 w - - 0 1').position;
    expect(evaluatePosition(healthy)).toBeGreaterThan(evaluatePosition(doubled));
  });
});
