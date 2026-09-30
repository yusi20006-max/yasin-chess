import {listGames, deleteGame, putGame} from './db';
import {CURRENT_SCHEMA_VERSION} from './migrations';
import type {ChessGame} from '../core/game';

/** Stable local history record for completed/saved games. */
export type StoredGame = {
  id: string;
  schemaVersion: number;
  startFEN: string;
  updatedAt: number;
  createdAt: number;
  position: unknown;
  history: unknown[];
  future?: unknown[];
  keys?: string[];
  result: string;
  mode: string;
  difficulty?: string;
  moveCount: number;
};

export type HistoryMeta = {
  mode?: string;
  difficulty?: string;
  id?: string;
};

function makeId(): string {
  return `game:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 8)}`;
}

/** Persist a completed or explicitly saved game into local history. */
export async function saveGameToHistory(game: ChessGame, meta: HistoryMeta = {}): Promise<StoredGame> {
  const id = meta.id ?? makeId();
  const now = Date.now();
  const record: StoredGame = {
    id,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    startFEN: game.startFEN,
    updatedAt: now,
    createdAt: now,
    position: game.position,
    history: game.history,
    future: game.future,
    keys: game.keys,
    result: game.resultToken(),
    mode: meta.mode ?? 'local',
    difficulty: meta.difficulty,
    moveCount: game.history.length,
  };
  await putGame(record);
  return record;
}

/** List all local history games (excludes active/backup slots). */
export async function getGameHistory(): Promise<StoredGame[]> {
  const all = await listGames<StoredGame>();
  return all
    .filter((g) => g && typeof g.id === 'string' && !g.id.startsWith('active'))
    .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

/** Remove one history entry by stable id. */
export const removeGameFromHistory = (id: string) => deleteGame(id);

/** Map history rows to the list shape required by UI (date, mode, result, moves, id). */
export function historyListItem(g: StoredGame) {
  return {
    id: g.id,
    date: new Date(g.updatedAt || g.createdAt || 0).toISOString(),
    mode: g.mode ?? 'local',
    difficulty: g.difficulty,
    result: g.result ?? '*',
    moveCount: g.moveCount ?? (Array.isArray(g.history) ? g.history.length : 0),
  };
}
