import {describe,expect,it} from 'vitest';
import {CURRENT_SCHEMA_VERSION,migrate} from '../src/storage/migrations';

describe('active persistence contract',()=>{
  it('uses an explicit current schema version',()=>{
    expect(CURRENT_SCHEMA_VERSION).toBeGreaterThanOrEqual(2);
  });

  it('upgrades legacy snapshots without dropping existing fields',()=>{
    const legacy={id:'active',startFEN:'start',position:{},history:[],future:[],keys:['k']};
    const migrated=migrate(legacy,1);
    expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(migrated.updatedAt).toEqual(expect.any(Number));
    expect(migrated.keys).toEqual(['k']);
  });
});
