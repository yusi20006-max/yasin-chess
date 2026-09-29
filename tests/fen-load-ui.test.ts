import {describe,expect,it} from 'vitest';
import {parseValidatedFEN,validateFEN} from '../src/app/importExport';

describe('FEN load UI contract',()=>{
 it('accepts the standard starting FEN',()=>expect(validateFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1').valid).toBe(true));
 it('rejects invalid FEN with a useful error',()=>{
  const result=validateFEN('8/8/8/8/8/8/8/8 w - - 0 1');
  expect(result.valid).toBe(false);
  if(!result.valid)expect(result.error).toMatch(/king/i);
 });
 it('loads validated FEN into a position',()=>expect(parseValidatedFEN('8/8/8/3k4/8/8/4K3/8 w - - 0 1').turn).toBe('w'));
});
