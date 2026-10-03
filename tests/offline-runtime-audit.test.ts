import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('offline runtime audit',()=>{
 const pkg=JSON.parse(readFileSync('package.json','utf8'));
 const sw=readFileSync('public/sw.js','utf8');
 const main=readFileSync('src/main.tsx','utf8');
 const html=readFileSync('index.html','utf8');

 it('ships an offline build and offline smoke command',()=>{
  expect(pkg.scripts['test:offline']).toBeTruthy();
  expect(pkg.scripts['audit:offline-assets']).toBeTruthy();
 });

 it('registers the service worker from the application entrypoint',()=>{
  expect(main).toContain('registerServiceWorker()');
  expect(html).toContain('/src/main.tsx');
 });

 it('has a navigation fallback and same-origin offline cache strategy',()=>{
  expect(sw).toMatch(/request\.mode\s*===\s*'navigate'/);
  expect(sw).toContain("caches.match('/index.html')");
  expect(sw).toMatch(/new URL\(request\.url\)\.origin\s*!==\s*self\.location\.origin/);
 });

 it('keeps offline runtime free from external network dependencies',()=>{
  expect(html).not.toMatch(/https?:\/\//);
  expect(sw).not.toMatch(/fetch\(['"]https?:\/\//);
 });
});
