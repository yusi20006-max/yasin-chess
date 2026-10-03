import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {APP_VERSION,SERVICE_WORKER_URL} from '../src/pwa/version';

describe('PWA update/versioning contract',()=>{
 const pkg=JSON.parse(readFileSync('package.json','utf8'));
 const sw=readFileSync('public/sw.js','utf8');
 const reg=readFileSync('src/pwa/registerSW.ts','utf8');
 it('keeps the application version aligned with package version',()=>{
  expect(APP_VERSION).toBe(pkg.version);
  expect(SERVICE_WORKER_URL).toContain('version='+APP_VERSION);
 });
 it('disables browser HTTP cache for service worker updates',()=>{
  expect(reg).toMatch(/updateViaCache\s*:\s*'none'/);
  expect(reg).toContain('registration.update()');
 });
 it('derives cache identity from the registration version',()=>{
  expect(sw).toContain("new URL(self.location.href).searchParams.get('version')");
  expect(sw).toContain('yasin-chess-${VERSION}-static');
 });
 it('supports an explicit update handoff message',()=>{
  expect(reg).toMatch(/type\s*:\s*'SKIP_WAITING'/);
  expect(sw).toMatch(/type\s*===\s*'SKIP_WAITING'/);
 });
});
