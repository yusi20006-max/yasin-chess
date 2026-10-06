import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('AI thinking UI contract',()=>{
  const app=readFileSync('src/ui/App.tsx','utf8');
  const css=readFileSync('src/ui/styles.css','utf8');

  it('binds the visible thinking state to the actual AI request state',()=>{
    expect(app).toContain('className={`thinking ${thinking?\'thinking-active\':\'\'}`}');
    expect(app).toContain('data-ai-thinking={thinking?"true":"false"}');
    expect(app).toContain('game.position.turn===\'b\'&&thinking?t(\'thinking\'):t(\'waiting\')');
  });

  it('keeps a stable indicator surface and reduced-motion behavior',()=>{
    expect(css).toMatch(/\.thinking\{[^}]*min-height:1\.25rem/);
    expect(css).toContain('.thinking-active:before');
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
    expect(css).toContain('.thinking-active:before{animation:none;');
  });
});
