import {getGameHistory, historyListItem, type StoredGame} from './history';

export async function searchGames(query = ''): Promise<StoredGame[]> {
  const games = await getGameHistory();
  const q = query.trim().toLowerCase();
  if (!q) return games;
  return games.filter(
    (g) =>
      g.id.toLowerCase().includes(q) ||
      g.startFEN.toLowerCase().includes(q) ||
      (g.mode ?? '').toLowerCase().includes(q) ||
      (g.result ?? '').toLowerCase().includes(q) ||
      (g.difficulty ?? '').toLowerCase().includes(q),
  );
}

export async function recentGames(limit = 50): Promise<StoredGame[]> {
  return (await getGameHistory()).slice(0, Math.max(0, limit));
}

/** UI-ready list rows: id, date, mode, result, moveCount. */
export async function recentHistoryItems(limit = 50) {
  return (await recentGames(limit)).map(historyListItem);
}
