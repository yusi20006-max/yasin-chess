import {describe,expect,it} from 'vitest';
import {existsSync,readFileSync} from 'node:fs';

describe('Stockfish offline asset contract',()=>{
 it('keeps the pinned lite single-threaded asset manifest explicit',()=>{
  const manifest=JSON.parse(readFileSync('public/engine/manifest.json','utf8'));
  expect(manifest.engine).toBe('Stockfish.js');
  expect(manifest.version).toBe('19.0.0');
  expect(manifest.build).toBe('lite-single');
  expect(manifest.license).toBe('GPL-3.0');
  for(const file of manifest.files)expect(existsSync('public/engine/'+file)).toBe(true);
 });
});
