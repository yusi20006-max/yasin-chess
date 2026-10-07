import {describe,expect,it} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {initialPosition} from '../src/core/board';
import {requestEngineEvaluation} from '../src/engine/adapter';

describe('evaluation bar contracts',()=>{
 it('keeps the bar beside the board without changing board geometry',()=>{
  const app=fs.readFileSync(path.join(process.cwd(),'src/ui/App.tsx'),'utf8');
  const component=fs.readFileSync(path.join(process.cwd(),'src/ui/EvaluationBar.tsx'),'utf8');
  const css=fs.readFileSync(path.join(process.cwd(),'src/ui/styles.css'),'utf8');
  expect(app).toMatch(/className="board-analysis-row"/);
  expect(app).toMatch(/<EvaluationBar/);
  expect(component).toMatch(/aria-label=/);
  expect(css).toMatch(/prefers-reduced-motion/);
  expect(css).toMatch(/\.board-analysis-row\{/);
  expect(css).toMatch(/\.evaluation-track\{/);
 });
 it('provides a deterministic approximate Minimax score through the common adapter',async()=>{
  const result=await requestEngineEvaluation('minimax',initialPosition(),2);
  expect(result.source).toBe('minimax');
  expect(result.approximate).toBe(true);
  expect(Number.isFinite(result.scoreCp)).toBe(true);
 });
});
