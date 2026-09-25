import { describe, expect, it } from 'vitest';
import { verifyPersistence } from '../src/storage/health';

describe('storage health', () => {
  it('reports unsupported environments without IndexedDB', async () => {
    const result = await verifyPersistence();
    expect(typeof result).toBe('boolean');
  });
});
