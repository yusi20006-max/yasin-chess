import {describe,expect,it} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {loadSettings,saveSettings} from '../src/app/settings';
import {setLocale,t} from '../src/i18n';

describe('UI regression contracts',()=>{
  it('uses deterministic SVG pieces and keeps coordinates board-relative',()=>{
    const piece=fs.readFileSync(path.join(process.cwd(),'src/ui/Piece.tsx'),'utf8');
    const pieceCss=fs.readFileSync(path.join(process.cwd(),'src/ui/piece-3d.css'),'utf8');
    const boardCss=fs.readFileSync(path.join(process.cwd(),'src/ui/board.css'),'utf8');
    const boardTsx=fs.readFileSync(path.join(process.cwd(),'src/ui/ChessBoard.tsx'),'utf8');
    expect(piece).toMatch(/<svg className="piece-svg"/);
    expect(piece).not.toMatch(/pieceGlyph\(/);
    expect(piece).toMatch(/data-piece-style="modern-3d"/);
    expect(piece).toMatch(/linearGradient/);
    expect(piece).toMatch(/feDropShadow/);
    expect(pieceCss).toMatch(/data-piece-style="modern-3d"/);
    expect(pieceCss).toMatch(/drop-shadow\(/);
    expect(boardTsx).toMatch(/import\s+['\"]\.\/board\.css['\"]/);
    expect(boardTsx).toMatch(/board-wrapper/);
    expect(boardTsx).toMatch(/rank-coords/);
    expect(boardTsx).toMatch(/file-coords/);
    expect(boardCss).toMatch(/\.board-wrapper\s*\{/);
    expect(boardCss).toMatch(/\.rank-coords\s*\{/);
    expect(boardCss).toMatch(/\.file-coords\s*\{/);
    expect(boardCss).toMatch(/pointer-events:\s*none/);
    expect(boardCss).toMatch(/-webkit-text-size-adjust:\s*none/);
    expect(boardCss).toMatch(/text-size-adjust:\s*none/);
    expect(boardCss).toMatch(/\.piece\s*\{[\s\S]*z-index:\s*2/);
    expect(boardCss).toMatch(/\.piece-svg\s*\{/);
  });
  it('defines a dedicated mobile appearance settings bottom sheet',()=>{
    const shell=fs.readFileSync(path.join(process.cwd(),'src/ui/AppShell.tsx'),'utf8');
    const app=fs.readFileSync(path.join(process.cwd(),'src/ui/App.tsx'),'utf8');
    const css=fs.readFileSync(path.join(process.cwd(),'src/ui/styles.css'),'utf8');
    expect(shell).toMatch(/settings\?: ReactNode/);
    expect(shell).toMatch(/settings-sheet/);
    expect(shell).toMatch(/appearance-trigger/);
    expect(app).toMatch(/settings={<>/);
    expect(css).toMatch(/\.settings-sheet\{/);
    expect(css).toMatch(/\.settings-sheet-backdrop\{/);
  });
  it('defines a compact mobile game HUD and primary action bar',()=>{
    const css=fs.readFileSync(path.join(process.cwd(),'src/ui/styles.css'),'utf8');
    const layout=fs.readFileSync(path.join(process.cwd(),'src/ui/GameLayout.tsx'),'utf8');
    const app=fs.readFileSync(path.join(process.cwd(),'src/ui/App.tsx'),'utf8');
    expect(app).toMatch(/className="player-panels"/);
    expect(layout).toMatch(/className="game-panel"/);
    expect(app).toMatch(/className="controls"/);
    expect(css).toMatch(/\.game-panel\{display:grid/);
    expect(css).toMatch(/\.game-panel \.controls\{order:3/);
    expect(css).toMatch(/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
  });
  it('defines a restrained Midnight glass visual system',()=>{
    const theme=fs.readFileSync(path.join(process.cwd(),'src/ui/theme.css'),'utf8');
    expect(theme).toMatch(/:root\[data-theme="dark"\]/);
    expect(theme).toMatch(/--midnight-blue:/);
    expect(theme).toMatch(/--midnight-violet:/);
    expect(theme).toMatch(/backdrop-filter:blur\(/);
    expect(theme).toMatch(/radial-gradient\(/);
    expect(theme).toMatch(/:root\[data-theme="light"\]/);
  });
  it('uses a board-first mobile shell with a dedicated options drawer',()=>{
    const shell=fs.readFileSync(path.join(process.cwd(),'src/ui/AppShell.tsx'),'utf8');
    const app=fs.readFileSync(path.join(process.cwd(),'src/ui/App.tsx'),'utf8');
    const css=fs.readFileSync(path.join(process.cwd(),'src/ui/styles.css'),'utf8');
    expect(shell).toMatch(/className="menu-trigger"/);
    expect(shell).toMatch(/settings-drawer/);
    expect(shell).toMatch(/menu-backdrop/);
    expect(shell).toMatch(/aria-controls="yasin-settings-menu"/);
    expect(app).toMatch(/sidebar={<>/);
    expect(app).toMatch(/data-section="game-settings"/);
    expect(app).toMatch(/data-section="board-view"/);
    expect(shell).toMatch(/appearance-trigger/);
    expect(app).toMatch(/settings={<>/);
    expect(app).not.toMatch(/<div className="view-controls">/);
    expect(css).toMatch(/\.settings-drawer\{/);
    expect(css).toMatch(/\.menu-trigger\{/);
  });
  it('settings survive reload boundary',()=>{
    localStorage.clear();
    saveSettings({theme:'dark',language:'en'});
    expect(loadSettings().theme).toBe('dark');
    expect(loadSettings().language).toBe('en');
  });
  it('locale updates text and direction',()=>{
    setLocale('fa');
    expect(t('newGame')).toBe('بازی جدید');
    expect(document.documentElement.dir).toBe('rtl');
    setLocale('en');
    expect(t('newGame')).toBe('New Game');
    expect(document.documentElement.dir).toBe('ltr');
  });
});
