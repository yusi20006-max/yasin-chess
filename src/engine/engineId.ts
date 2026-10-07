/** Selectable chess engine identifiers (Issue #410). */
export type EngineId = 'minimax' | 'stockfish-wasm';

export const ENGINE_IDS: EngineId[] = ['minimax', 'stockfish-wasm'];

export const ENGINE_LABELS: Record<EngineId, {en: string; fa: string; descriptionEn: string; descriptionFa: string}> = {
  minimax: {
    en: 'Local Minimax',
    fa: '\u0645\u06cc\u0646\u06cc\u200c\u0645\u06a9\u0633 \u0645\u062d\u0644\u06cc',
    descriptionEn: 'Built-in engine \u2014 fast, offline, low memory',
    descriptionFa: '\u0645\u0648\u062a\u0648\u0631 \u062f\u0627\u062e\u0644\u06cc \u2014 \u0633\u0631\u06cc\u0639\u060c \u0622\u0641\u0644\u0627\u06cc\u0646\u060c \u062d\u0627\u0641\u0638\u0647 \u06a9\u0645',
  },
  'stockfish-wasm': {
    en: 'Stockfish WASM',
    fa: '\u0627\u0633\u062a\u0648\u06a9\u200c\u0641\u06cc\u0634 WASM',
    descriptionEn: 'Stronger engine (lite WASM) \u2014 higher memory; falls back to Minimax if unavailable',
    descriptionFa: '\u0645\u0648\u062a\u0648\u0631 \u0642\u0648\u06cc\u200c\u062a\u0631 (WASM \u0633\u0628\u06a9) \u2014 \u062d\u0627\u0641\u0638\u0647 \u0628\u06cc\u0634\u062a\u0631\u061b \u062f\u0631 \u0635\u0648\u0631\u062a \u062e\u0637\u0627 \u0628\u0647 \u0645\u06cc\u0646\u06cc\u200c\u0645\u06a9\u0633 \u0628\u0631\u0645\u06cc\u200c\u06af\u0631\u062f\u062f',
  },
};

export function isEngineId(value: unknown): value is EngineId {
  return value === 'minimax' || value === 'stockfish-wasm';
}

export const DEFAULT_ENGINE_ID: EngineId = 'minimax';
