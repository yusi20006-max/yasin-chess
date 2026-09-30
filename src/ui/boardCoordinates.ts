import type {Square} from '../core/types';
import {fileOf, rankOf} from '../core/board';

const FILES = 'abcdefgh';

/** Rank/file labels for a given orientation (Phase 4 / #39). */
export function boardRanks(orientation: 'white' | 'black' = 'white'): number[] {
  return orientation === 'white' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
}

export function boardFiles(orientation: 'white' | 'black' = 'white'): number[] {
  return orientation === 'white' ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0];
}

export function fileLabel(file: number): string {
  return FILES[file] ?? '';
}

export function rankLabel(rank: number): string {
  return String(rank + 1);
}

export function shouldShowFileLabel(square: Square, orientation: 'white' | 'black'): boolean {
  const r = rankOf(square);
  return orientation === 'white' ? r === 0 : r === 7;
}

export function shouldShowRankLabel(square: Square, orientation: 'white' | 'black'): boolean {
  const f = fileOf(square);
  return orientation === 'white' ? f === 0 : f === 7;
}
