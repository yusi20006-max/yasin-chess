import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('Android lifecycle contract',()=>{
 const source=readFileSync('src/pwa/androidLifecycle.ts','utf8');
 const main=readFileSync('src/main.tsx','utf8');
 it('registers Android back navigation once',()=>{
  expect(source).toContain("App.addListener('backButton'");
  expect(source).toContain('let registered=false');
  expect(source).toContain('if(registered');
 });
 it('preserves web history and exits only at the root',()=>{
  expect(source).toContain('event.canGoBack');
  expect(source).toContain('window.history.back()');
  expect(source).toContain('App.exitApp()');
 });
 it('is part of the application bootstrap',()=>{
  expect(main).toContain('registerAndroidLifecycle');
 });
});
