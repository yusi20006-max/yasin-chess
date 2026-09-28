import {describe,expect,it} from 'vitest';
import {selectRecoverySnapshot} from '../src/storage/recovery';

const snapshot=(updatedAt:number)=>({
  id:'active',schemaVersion:2,updatedAt,startFEN:'start',
  position:{},history:[],future:[],keys:[]
});

describe('persistence crash recovery',()=>{
  it('prefers the newest valid snapshot',()=>{
    expect(selectRecoverySnapshot(snapshot(10),snapshot(20))?.updatedAt).toBe(20);
  });
  it('falls back when the primary snapshot is invalid',()=>{
    const invalid={id:'active',schemaVersion:2,updatedAt:30,startFEN:'',position:{},history:[],future:[]};
    expect(selectRecoverySnapshot(invalid as never,snapshot(20))?.updatedAt).toBe(20);
  });
  it('returns no snapshot when both candidates are invalid',()=>{
    expect(selectRecoverySnapshot(undefined,undefined)).toBeUndefined();
  });
});
