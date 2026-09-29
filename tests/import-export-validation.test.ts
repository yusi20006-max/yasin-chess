import {describe,expect,it} from 'vitest';
import {validateFEN,validatePGN,parseValidatedFEN,positionToFEN} from '../src/app/importExport';

describe('import/export validation',()=>{
 it('accepts and round-trips a valid FEN',()=>{
  const fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const p=parseValidatedFEN(fen);
  expect(positionToFEN(p)).toBe(fen);
 });
 it('rejects malformed FEN without throwing from the validator',()=>{
  const result=validateFEN('8/8/8/8/8/8/8/8 w - - 0 1');
  expect(result.valid).toBe(false);
 });
 it('rejects malformed PGN safely',()=>{
  expect(validatePGN('[Event "x"]\n\n1. e4 BAD *').valid).toBe(false);
  expect(validatePGN('1. e4 e5 *').valid).toBe(true);
 });
 it('rejects unclosed PGN comments/variations',()=>{
  expect(validatePGN('1. e4 {comment *').valid).toBe(false);
  expect(validatePGN('1. e4 (1... e5 *').valid).toBe(false);
 });
});
