import {describe,expect,it} from 'vitest';
import {findOpening,OPENING_DATASET_VERSION} from '../src/engine/openings';

describe('offline opening explorer',()=>{
 it('detects common openings deterministically',()=>{
  expect(findOpening(['e4','e5','Nf3','Nc6','Bb5']).name).toBe('Ruy López');
  expect(findOpening(['d4','Nf6','c4','g6','Nc3']).family).toBe("King's Indian Defense");
 });
 it('detects a named variation when the full prefix matches',()=>{
  const match=findOpening(['e4','e5','Nf3','Nc6','Bc4','Bc5']);
  expect(match.name).toBe('Giuoco Piano');
  expect(match.variation).toBe('Giuoco Piano');
  expect(match.confidence).toBe('high');
 });
 it('provides known continuations from a shorter prefix',()=>{
  const match=findOpening(['e4','e5','Nf3','Nc6','Bc4']);
  expect(match.nextMoves).toContain('Bc5');
  expect(match.nextMoves).toContain('Nf6');
 });
 it('falls back without guessing unknown lines',()=>{
  expect(findOpening(['a3','h6','Ra2']).confidence).toBe('unknown');
  expect(findOpening(['e4','e5']).name).toBe('Open Game');
 });
 it('uses a versioned deterministic dataset',()=>expect(OPENING_DATASET_VERSION).toBe('1.0.0'));
});
