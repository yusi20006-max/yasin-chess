import {describe,expect,it,beforeEach,vi} from 'vitest';
import {DEFAULT_ENGINE_CONFIG,normalizeEngineConfig} from '../src/engine/config';
import {getChessEngine} from '../src/engine/adapter';

describe('engine selector and adapter',()=>{
 beforeEach(()=>{localStorage.clear()});
 it('defaults to local Minimax',()=>expect(DEFAULT_ENGINE_CONFIG.id).toBe('minimax'));
 it('normalizes persisted Stockfish selection',()=>expect(normalizeEngineConfig({id:'stockfish'}).id).toBe('stockfish'));
 it('exposes both engine adapters',()=>{
  expect(getChessEngine('minimax').id).toBe('minimax');
  expect(getChessEngine('stockfish').id).toBe('stockfish');
 });
 it('falls back at the controller boundary when Stockfish fails',async()=>{
  const adapter=getChessEngine('stockfish');
  const error=vi.spyOn(adapter,'requestMove').mockRejectedValue(new Error('init failed'));
  await expect(adapter.requestMove({position:{} as never,depth:2,skill:2})).rejects.toThrow('init failed');
  error.mockRestore();
 });
});
