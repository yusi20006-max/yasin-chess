import 'fake-indexeddb/auto';
import {describe,expect,it} from 'vitest';
import {deleteGame,getGame,listGames,putGame} from '../src/storage/db';

describe('IndexedDB storage layer',()=>{
  it('supports asynchronous typed CRUD independent of UI',async()=>{
    const value={id:'storage-layer-contract',position:{turn:'w'}};
    await putGame(value);
    expect(await getGame<typeof value>(value.id)).toEqual(value);
    expect(await listGames<typeof value>()).toContainEqual(value);
    await deleteGame(value.id);
    expect(await getGame(value.id)).toBeUndefined();
  });
  it('keeps records isolated by id',async()=>{
    const a={id:'storage-a',value:1};
    const b={id:'storage-b',value:2};
    await putGame(a);await putGame(b);
    expect(await getGame<typeof a>('storage-a')).toEqual(a);
    expect(await getGame<typeof b>('storage-b')).toEqual(b);
    await deleteGame(a.id);await deleteGame(b.id);
  });
});
