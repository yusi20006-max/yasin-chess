import {describe,expect,it} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';
import {parseStockfishEvaluation} from '../src/engine/stockfish';

describe('Stockfish offline asset contract',()=>{
 it('parses cp and mate scores from UCI info lines',()=>{
  expect(parseStockfishEvaluation('info depth 8 score cp 37 nodes 1000','w')).toEqual({scoreCp:37});
  expect(parseStockfishEvaluation('info depth 8 score cp 37 nodes 1000','b')).toEqual({scoreCp:-37});
  expect(parseStockfishEvaluation('info depth 8 score mate -3 nodes 1000','w')).toEqual({scoreCp:0,mate:-3});
  expect(parseStockfishEvaluation('info depth 8 score mate -3 nodes 1000','b')).toEqual({scoreCp:0,mate:3});
 });
 it('keeps the pinned lite single-threaded asset manifest explicit',()=>{
  const manifest=JSON.parse(readFileSync('public/engine/manifest.json','utf8'));
  expect(manifest.engine).toBe('Stockfish.js');
  expect(manifest.version).toBe('19.0.0');
  expect(manifest.build).toBe('lite-single');
  expect(manifest.license).toBe('GPL-3.0');
  for(const file of manifest.files)expect(existsSync('public/engine/'+file)).toBe(true);
 });
});
