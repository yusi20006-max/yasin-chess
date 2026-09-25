import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('Android UI contract', () => {
  it('keeps standalone viewport and safe-area metadata', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain('viewport-fit=cover');
    expect(html).toContain('mobile-web-app-capable');
  });
  it('keeps responsive portrait and landscape styles in the application', () => {
    expect(readFileSync('src/ui/portrait.css','utf8')).toContain('orientation:portrait');
    expect(readFileSync('src/ui/landscape.css','utf8')).toContain('orientation:landscape');
    expect(readFileSync('src/ui/safeArea.css','utf8')).toContain('safe-area-inset-bottom');
  });
});
