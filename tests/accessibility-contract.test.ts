import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('accessibility contract',()=>{
 const board=readFileSync('src/ui/ChessBoard.tsx','utf8');
 const layout=readFileSync('src/ui/GameLayout.tsx','utf8');
 it('exposes grid, selected and current state semantics',()=>{expect(board).toContain('role="grid"');expect(board).toContain('aria-selected');expect(board).toContain('aria-current');expect(board).toMatch(/e\.key\s*===\s*['"]Escape['"]/);});
 it('provides keyboard guidance and labelled game region',()=>{expect(layout).toContain('aria-describedby="chess-game-help"');expect(layout).toContain('Press Escape')});
});
