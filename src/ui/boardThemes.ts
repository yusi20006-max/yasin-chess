import type {BoardTheme} from './boardSettings';

/** Named board + piece theme presets (Phase 4 / #44). */
export const BOARD_THEME_PRESETS: Record<string, BoardTheme & {id: string; label: string}> = {
  classic: {id: 'classic', label: 'Classic', light: '#f0d9b5', dark: '#b58863', piece: '#111827'},
  green: {id: 'green', label: 'Green', light: '#d8e8c8', dark: '#6b8f71', piece: '#111827'},
  blue: {id: 'blue', label: 'Blue', light: '#cfd8ea', dark: '#5b6f9c', piece: '#111827'},
  dark: {id: 'dark', label: 'Dark Arena', light: '#4b5563', dark: '#1f2937', piece: '#e5e7eb'},
  highContrast: {id: 'highContrast', label: 'High Contrast', light: '#f8fafc', dark: '#0f172a', piece: '#111827'},
};

export function listBoardThemes() {
  return Object.values(BOARD_THEME_PRESETS);
}

export function getBoardThemePreset(id: string): BoardTheme {
  return BOARD_THEME_PRESETS[id] ?? BOARD_THEME_PRESETS.classic;
}
