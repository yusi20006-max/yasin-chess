/**
 * Architecture boundary constants (Phase 2 / #32).
 * Used by docs and regression tests — not runtime chess logic.
 */

export const LAYERS = [
  'core',
  'engine',
  'app',
  'storage',
  'pwa',
  'platform',
  'ui',
] as const;

export type Layer = (typeof LAYERS)[number];

/** Allowed dependency edges: from → to[] */
export const ALLOWED_DEPENDENCIES: Record<Layer, readonly Layer[]> = {
  core: [],
  engine: ['core'],
  app: ['core', 'engine', 'storage'],
  storage: ['core'],
  pwa: [],
  platform: [],
  ui: ['core', 'app', 'storage', 'pwa', 'platform'],
};

export function canDepend(from: Layer, to: Layer): boolean {
  if (from === to) return true;
  return ALLOWED_DEPENDENCIES[from].includes(to);
}

export const STATE_OWNERS = {
  boardAndRules: 'core',
  aiSearch: 'engine',
  modesAndSettings: 'app',
  persistence: 'storage',
  offlineCache: 'pwa',
  osLifecycle: 'platform',
  viewState: 'ui',
} as const;
