import 'fake-indexeddb/auto';
import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {clearActiveGame,saveActiveGame,resumeActiveGame,ACTIVE_ID,ACTIVE_BACKUP_ID} from '../src/storage/activeGame';
import {getGame,putGame} from '../src/storage/db';

describe('crash and reload recovery',()=>{
  it('chooses the newest valid snapshot',async()=>{
    await clearActiveGame();
    const game=new ChessGame();
    await saveActiveGame(game);
    const move=game.position.board.findIndex(Boolean);
    expect(move).toBeGreaterThanOrEqual(0);
    game.history.push({san:'test',move:{from:move,to:move}});
    await saveActiveGame(game);
    const restored=await resumeActiveGame();
    expect(restored).toBeDefined();
    expect(restored?.history.length).toBe(1);
    await clearActiveGame();
  });
  it('falls back to backup when primary is corrupted',async()=>{
    await clearActiveGame();
    const game=new ChessGame();
    await saveActiveGame(game);
    game.history.push({san:'test',move:{from:0,to:1}});
    await saveActiveGame(game);
    const primary=await getGame<any>(ACTIVE_ID);
    expect(primary).toBeDefined();
    await putGame({...primary,position:{board:[],turn:'x'}});
    const restored=await resumeActiveGame();
    expect(restored).toBeDefined();
    expect(restored?.history.length).toBe(0);
    await clearActiveGame();
  });
  it('returns no game when both records are invalid',async()=>{
    await clearActiveGame();
    await putGame({id:ACTIVE_ID,schemaVersion:3,updatedAt:10});
    await putGame({id:ACTIVE_BACKUP_ID,schemaVersion:3,updatedAt:9});
    await expect(resumeActiveGame()).resolves.toBeUndefined();
    await clearActiveGame();
  });
});
