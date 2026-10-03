import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('service worker lifecycle contract',()=>{
 const sw=readFileSync('public/sw.js','utf8');
 it('defines deterministic install and activation lifecycle',()=>{
  expect(sw).toContain("self.addEventListener('install'");
  expect(sw).toContain("self.skipWaiting()");
  expect(sw).toContain("self.addEventListener('activate'");
  expect(sw).toContain("self.clients.claim()");
 });
 it('owns and removes only its own cache family',()=>{
  expect(sw).toContain("key.startsWith('yasin-chess-')");
  expect(sw).toMatch(/key\s*!==\s*CACHE_NAME/);
 });
 it('handles navigation and cached asset fallback offline',()=>{
  expect(sw).toMatch(/request\.mode\s*===\s*'navigate'/);
  expect(sw).toContain("caches.match('/index.html')");
  expect(sw).toContain("caches.match(request)");
 });
 it('ignores non-GET and cross-origin requests',()=>{
  expect(sw).toMatch(/request\.method\s*!==\s*'GET'/);
  expect(sw).toMatch(/new URL\(request\.url\)\.origin\s*!==\s*self\.location\.origin/);
 });
});
