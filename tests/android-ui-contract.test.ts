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
  it('locks the redesigned mobile shell, theme, and responsive board geometry', () => {
    const app = readFileSync('src/ui/App.tsx','utf8');
    const shell = readFileSync('src/ui/AppShell.tsx','utf8');
    const css = readFileSync('src/ui/styles.css','utf8');
    const theme = readFileSync('src/ui/theme.css','utf8');
    const board = readFileSync('src/ui/board.css','utf8');
    expect(app).toContain('GameLayout');
    expect(shell).toContain('menu-trigger');
    expect(shell).toContain('settings-drawer');
    expect(shell).toContain('settings-sheet');
    expect(css).toMatch(/max-width:\s*100%/);
    expect(css).toMatch(/overflow-x:\s*hidden/);
    expect(theme).toContain('--midnight-blue');
    expect(theme).toContain('--midnight-violet');
    expect(theme).toContain('radial-gradient');
    expect(board).toContain('grid-template-areas');
    expect(board).toContain('direction: ltr');
    expect(board).toContain('pointer-events: none');
  });
  it('board coordinates use a board-relative wrapper imported into the bundle', () => {
    const boardTsx = readFileSync('src/ui/ChessBoard.tsx', 'utf8');
    const boardCss = readFileSync('src/ui/board.css', 'utf8');
    expect(boardTsx).toMatch(/import\s+['"]\.\/board\.css['"]/);
    expect(boardTsx).toContain('board-wrapper');
    expect(boardTsx).toContain('rank-coords');
    expect(boardTsx).toContain('file-coords');
    expect(boardCss).toContain('grid-template-areas');
    expect(boardCss).toMatch(/pointer-events:\s*none/);
  });
});
