import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('Android identity contract',()=>{
 const pkg=JSON.parse(readFileSync('package.json','utf8'));
 const cap=readFileSync('capacitor.config.ts','utf8');
 it('keeps stable application identity',()=>{
  expect(pkg.name).toBe('yasin-chess');
  expect(cap).toContain("appId: 'com.yasin.chess'");
  expect(cap).toContain("appName: 'Yasin Chess'");
  expect(cap).toContain("webDir: 'dist'");
 });
 it('keeps a release-ready semantic version',()=>{
  expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
 });
});
