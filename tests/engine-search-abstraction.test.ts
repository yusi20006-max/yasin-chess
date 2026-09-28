import {describe,expect,it,vi} from 'vitest';
import {searchMove,type EngineSearch} from '../src/engine/search';
import type {Move} from '../src/core/types';
describe('engine search abstraction',()=>{
 it('keeps runtime independent from concrete search implementation',()=>{
  const move={from:12,to:28} as Move;
  const engine:EngineSearch={search:vi.fn(()=>({move,depth:1,nodes:1,timedOut:false}))};
  expect(searchMove(engine,{} as never,3)).toEqual(move);
  expect(engine.search).toHaveBeenCalled();
 });
});
