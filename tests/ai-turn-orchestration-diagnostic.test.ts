import {describe,expect,it,beforeEach} from 'vitest';
import {aiTraceEnabled,traceAiTurn} from '../src/app/aiTurnDiagnostic';

describe('AI turn orchestration diagnostic',()=>{
  beforeEach(()=>{
    sessionStorage.clear();
  });

  it('is inert unless explicitly enabled',()=>{
    traceAiTurn('effect-enter',{turn:'b'});
    expect(sessionStorage.getItem('yasin-chess-ai-trace-log')).toBeNull();
    expect(aiTraceEnabled()).toBe(false);
  });

  it('records the orchestration boundary sequence without affecting execution',()=>{
    sessionStorage.setItem('yasin-chess-ai-trace','1');
    traceAiTurn('effect-enter',{turn:'b'});
    traceAiTurn('effect-request',{request:1,turn:'b'});
    traceAiTurn('timer-fired',{request:1,turn:'b'});
    traceAiTurn('choose-start',{request:1});
    traceAiTurn('choose-return',{request:1,move:{from:10,to:26}});
    traceAiTurn('request-guard-pass',{request:1});
    traceAiTurn('game-guard-pass',{request:1,sameGame:true});
    traceAiTurn('move-applied',{request:1,move:{from:10,to:26}});
    const log=JSON.parse(sessionStorage.getItem('yasin-chess-ai-trace-log')!);
    expect(log.map((x:{event:string})=>x.event)).toEqual([
      'effect-enter','effect-request','timer-fired','choose-start',
      'choose-return','request-guard-pass','game-guard-pass','move-applied'
    ]);
    expect(log.at(-1).request).toBe(1);
    expect(log.at(-1).move).toEqual({from:10,to:26});
  });

  it('keeps only the latest diagnostic records',()=>{
    sessionStorage.setItem('yasin-chess-ai-trace','1');
    for(let i=0;i<105;i++)traceAiTurn('effect-enter',{request:i});
    const log=JSON.parse(sessionStorage.getItem('yasin-chess-ai-trace-log')!);
    expect(log).toHaveLength(100);
    expect(log[0].request).toBe(5);
    expect(log.at(-1).request).toBe(104);
  });
});
