import {describe,expect,it} from 'vitest';
import {classifyEvaluation,analyzeGame} from '../src/engine/classification';
import {initialPosition} from '../src/core/board';
import {legalMoves} from '../src/core/moves';

describe('post-game move classification',()=>{
 it('uses win-chance loss bands rather than raw centipawns',()=>{
  const before={scoreCp:0,approximate:false,source:'stockfish' as const};
  expect(classifyEvaluation(before,{scoreCp:20,approximate:false,source:'stockfish'},'w',false)).toBe('excellent');
  expect(classifyEvaluation(before,{scoreCp:-250,approximate:false,source:'stockfish'},'w',false)).toBe('mistake');
  expect(classifyEvaluation(before,{scoreCp:-500,approximate:false,source:'stockfish'},'w',false)).toBe('blunder');
 });
 it('marks Minimax classifications as approximate',async()=>{
  const position=initialPosition();const move=legalMoves(position)[0];const after={...position,board:[...position.board]};
  const result=await analyzeGame([{move,before:position,after}], 'minimax', 1);
  expect(result).toHaveLength(1);
  expect(result[0].approximate).toBe(true);
  expect(['excellent','good','inaccuracy','mistake','blunder','brilliant']).toContain(result[0].classification);
 });
});
