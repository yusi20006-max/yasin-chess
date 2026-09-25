import { describe, expect, it } from 'vitest';
import { runtimeKind, isStandaloneRuntime } from '../src/platform/runtime';

describe('runtime detection', () => {
  it('returns a supported runtime kind', () => {
    expect(['web', 'android', 'ios']).toContain(runtimeKind());
  });
  it('does not claim standalone web runtime', () => {
    if (runtimeKind() === 'web') expect(isStandaloneRuntime()).toBe(false);
  });
});
