import 'fake-indexeddb/auto';
import {describe,expect,it} from 'vitest';
import {deleteGame,getGame,putGame} from '../src/storage/db';
import {CURRENT_SCHEMA_VERSION,migrate} from '../src/storage/migrations';

describe('versioned persistence schema',()=>{
 it('tracks the current schema version',()=>expect(CURRENT_SCHEMA_VERSION).toBe(3));
 it('migrates legacy snapshots deterministically',()=>{
  const legacy={id:'legacy',schemaVersion:1,updatedAt:0,startFEN:'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',position:{},history:[]};
  const migrated=migrate(legacy,1);
  expect(migrated.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  expect(Array.isArray(migrated.future)).toBe(true);
  expect(Array.isArray(migrated.keys)).toBe(true);
 });
 it('persists records through the versioned store',async()=>{
  const value={id:'schema-regression',schemaVersion:CURRENT_SCHEMA_VERSION,updatedAt:1};
  await putGame(value);
  expect(await getGame<typeof value>(value.id)).toEqual(value);
  await deleteGame(value.id);
 });
});
