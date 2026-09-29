import {describe,expect,it} from 'vitest';
import {CURRENT_SCHEMA_VERSION,migrate} from '../src/storage/migrations';

describe('storage schema migrations',()=>{
  it('tracks the current schema version',()=>expect(CURRENT_SCHEMA_VERSION).toBe(3));
  it('migrates legacy snapshots forward without losing data',()=>{
    const migrated=migrate({id:'legacy',schemaVersion:1,updatedAt:123});
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.updatedAt).toBe(123);
    expect(migrated.future).toEqual([]);
    expect(migrated.keys).toEqual([]);
  });
  it('rejects unsupported future schemas',()=>expect(()=>migrate({schemaVersion:99})).toThrow(/future/));
  it('rejects invalid schema versions',()=>expect(()=>migrate({schemaVersion:0})).toThrow(/schema version/));
});
