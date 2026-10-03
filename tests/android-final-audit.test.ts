import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('Android final release contract',()=>{
 const pkg=JSON.parse(readFileSync('package.json','utf8'));
 const cap=readFileSync('capacitor.config.ts','utf8');
 const manifest=JSON.parse(readFileSync('public/manifest.webmanifest','utf8'));
 const html=readFileSync('index.html','utf8');
 const sw=readFileSync('public/sw.js','utf8');
 it('keeps Android/PWA identity and standalone metadata aligned',()=>{
  expect(pkg.name).toBe('yasin-chess');
  expect(cap).toContain("appId: 'com.yasin.chess'");
  expect(manifest.display).toBe('standalone');
  expect(manifest.start_url).toBe('/');
 });
 it('keeps offline/security boundaries intact',()=>{
  expect(cap).toContain('cleartext: false');
  expect(html).toContain("connect-src 'self'");
  expect(sw).toMatch(/request\.mode\s*===\s*'navigate'/);
 });
 it('keeps release tooling available',()=>{
  expect(pkg.scripts['android:debug']).toBeTruthy();
  expect(pkg.scripts['audit:android-identity']).toBeTruthy();
  expect(pkg.scripts['audit:android-signing']).toBeTruthy();
  expect(pkg.scripts['audit:android-final']).toBeTruthy();
 });
});
