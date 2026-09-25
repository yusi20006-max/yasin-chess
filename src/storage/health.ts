import { deleteGame, getGame, putGame } from './db';

export async function verifyPersistence(): Promise<boolean> {
  if (typeof indexedDB === 'undefined') return false;
  const id = '__yasin_chess_storage_probe__';
  const payload = { id, probe: Date.now() };
  try {
    await putGame(payload);
    const restored = await getGame<typeof payload>(id);
    await deleteGame(id);
    return restored?.id === id && restored.probe === payload.probe;
  } catch {
    try { await deleteGame(id); } catch {}
    return false;
  }
}
