const KEY = 'yasin-chess-startup-v1';

export type StartupRecord = { startedAt: number; runtime: string };

export function recordStartup(runtime: string): StartupRecord {
  const record = { startedAt: Date.now(), runtime };
  try { sessionStorage.setItem(KEY, JSON.stringify(record)); } catch {}
  return record;
}

export function readStartup(): StartupRecord | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as StartupRecord;
    return typeof value.startedAt === 'number' && typeof value.runtime === 'string' ? value : null;
  } catch { return null; }
}
