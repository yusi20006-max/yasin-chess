import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('PWA installability contract',()=>{
 const manifest=JSON.parse(readFileSync('public/manifest.webmanifest','utf8'));
 const html=readFileSync('index.html','utf8');

 it('declares standalone install metadata',()=>{
  expect(manifest.name).toBe('Yasin Chess');
  expect(manifest.short_name).toBeTruthy();
  expect(manifest.start_url).toBe('/');
  expect(manifest.scope).toBe('/');
  expect(manifest.display).toBe('standalone');
  expect(manifest.lang).toBe('fa');
  expect(manifest.dir).toBe('rtl');
 });

 it('declares at least one usable application icon',()=>{
  expect(manifest.icons.length).toBeGreaterThan(0);
  expect(manifest.icons[0].src).toBe('/icon.svg');
  expect(manifest.icons[0].purpose).toContain('maskable');
 });

 it('links the manifest and icon from the application shell',()=>{
  expect(html).toContain('rel="manifest"');
  expect(html).toContain('href="/manifest.webmanifest"');
  expect(html).toContain('href="/icon.svg"');
 });
});
