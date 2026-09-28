import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('UX state regression contract',()=>{
 const app=readFileSync('src/ui/App.tsx','utf8');
 it('invalidates pending AI work on undo, redo and new game',()=>{
  expect((app.match(/requestRef\.current\+\+/g)||[]).length).toBeGreaterThanOrEqual(3);
  expect(app).toContain('const undo=()=>{requestRef.current++;setThinking(false)');
  expect(app).toContain('const redo=()=>{requestRef.current++;setThinking(false)');
  expect(app).toContain('const fresh=()=>{requestRef.current++;setThinking(false)');
 });
 it('clears selection and promotion on state-reset actions',()=>{
  expect(app).toContain('if(undoTurnPair(next,\'human-vs-ai\'))setGame(next);setSelected(null)');
  expect(app).toContain('if(redoTurnPair(next,\'human-vs-ai\'))setGame(next);setSelected(null)');
  expect(app).toContain('setGame(new ChessGame());setSelected(null);setLast(\'\')');
 });
 it('guards AI responses against stale game/request identity',()=>{
  expect(app).toContain('current!==snapshot||request!==requestRef.current');
  expect(app).toContain('request!==requestRef.current');
 });
 it('keeps promotion and game-over states named for assistive technology',()=>{
  expect(app).toContain('role="dialog"');
  expect(app).toContain('aria-modal="true"');
  expect(app).toContain("t('choosePromotion')");
  expect(app).toContain("t('gameOver')");
 });
});
