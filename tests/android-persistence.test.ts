import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { deleteGame, getGame, putGame } from '../src/storage/db';

describe('Android persistence contract', () => {
  it('round-trips a game record through IndexedDB', async () => {
    const value={id:'android-regression', position:'test'};
    await putGame(value);
    expect(await getGame<typeof value>(value.id)).toEqual(value);
    await deleteGame(value.id);
    expect(await getGame(value.id)).toBeUndefined();
  });
});
