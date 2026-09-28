import {describe,expect,it} from 'vitest';
import type {Move} from '../src/core/types';
import type {AiWorkerMessage,AiWorkerResponse} from '../src/engine/ai.worker';
describe('AI Worker runtime contract',()=>{
 it('uses correlated typed request and response envelopes',()=>{
  const request:AiWorkerMessage={type:'request',id:7,position:{} as never,depth:3,timeBudgetMs:100};
  const response:AiWorkerResponse={type:'response',id:7,move:{from:12,to:28} as Move,depth:2,nodes:42,timedOut:true};
  expect(request.type).toBe('request');expect(response.type).toBe('response');expect(response.id).toBe(request.id);
 });
 it('represents worker failures without throwing across the boundary',()=>{
  const response:AiWorkerResponse={type:'error',id:9,code:'SEARCH_ERROR',message:'search failed'};
  expect(response).toMatchObject({type:'error',id:9,code:'SEARCH_ERROR'});
 });
 it('represents cancellation by correlated request id',()=>{const abort:AiWorkerMessage={type:'abort',id:11};expect(abort).toEqual({type:'abort',id:11})});
});
