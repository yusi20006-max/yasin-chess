import {describe,expect,it} from 'vitest';
import {parsePGN} from '../src/app/importExport';

describe('professional PGN import',()=>{
 it('imports a legal mainline and preserves headers',()=>{
  const parsed=parsePGN('[Event "Demo"]\n[Result "*"]\n\n1. e4 e5 2. Nf3 Nc6 *');
  expect(parsed.headers.Event).toBe('Demo');
  expect(parsed.game.history.map(x=>x.san)).toEqual(['e4','e5','Nf3','Nc6']);
 });
 it('imports a FEN-start game',()=>{
  const parsed=parsePGN('[SetUp "1"]\n[FEN "8/8/8/3k4/8/8/4K3/8 w - - 0 1"]\n[Result "*"]\n\n*');
  expect(parsed.game.startFEN).toContain('3k4');
  expect(parsed.game.history).toHaveLength(0);
 });
 it('ignores comments and side variations',()=>{
  const parsed=parsePGN('1. e4 {comment} (1. d4 d5) e5 2. Nf3 *');
  expect(parsed.game.history.map(x=>x.san)).toEqual(['e4','e5','Nf3']);
 });
 it('rejects illegal mainline moves',()=>expect(()=>parsePGN('1. e4 e5 2. e4 *')).toThrow(/Illegal|unsupported/));
});
