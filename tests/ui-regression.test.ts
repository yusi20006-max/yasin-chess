import {describe,expect,it} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {loadSettings,saveSettings} from '../src/app/settings';
import {setLocale,t} from '../src/i18n';

describe('UI regression contracts',()=>{
  it('uses deterministic SVG pieces and keeps coordinates board-relative',()=>{
    const piece=fs.readFileSync(path.join(process.cwd(),'src/ui/Piece.tsx'),'utf8');
    const boardCss=fs.readFileSync(path.join(process.cwd(),'src/ui/board.css'),'utf8');
    const boardTsx=fs.readFileSync(path.join(process.cwd(),'src/ui/ChessBoard.tsx'),'utf8');
    expect(piece).toMatch(/<svg className="piece-svg"/);
    expect(piece).not.toMatch(/pieceGlyph\(/);
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
