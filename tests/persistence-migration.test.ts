import {describe,expect,it} from 'vitest';
import {CURRENT_SCHEMA_VERSION,migrate} from '../src/storage/migrations';

describe('persistence migrations',()=>{
  it('migrates legacy v1 snapshots through every supported version',()=>{
    const migrated=migrate({id:'active',history:[],position:{}},1);
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.updatedAt).toEqual(expect.any(Number));
    expect(migrated.future).toEqual([]);
    expect(migrated.keys).toEqual([]);
  });

  it('migrates v2 snapshots without losing existing data',()=>{
    const migrated=migrate({id:'active',schemaVersion:2,updatedAt:10,history:[1],position:{},keys:['a']},2);
    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.history).toEqual([1]);
    expect(migrated.keys).toEqual(['a']);
    expect(migrated.future).toEqual([]);
  });

  it('rejects malformed and future schema versions',()=>{
    expect(()=>migrate({schemaVersion:0},0)).toThrow(/schema version/);
    expect(()=>migrate({schemaVersion:CURRENT_SCHEMA_VERSION+1},CURRENT_SCHEMA_VERSION+1)).toThrow(/future/);
  });
});
