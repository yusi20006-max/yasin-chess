import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';

describe('Android release signing contract',()=>{
 it('does not commit common keystore artifacts',()=>{
  const gitignore=readFileSync('.gitignore','utf8');
  expect(gitignore).toMatch(/\\.jks|keystore/);
 });
 it('documents secret-backed signing inputs',()=>{
  const doc=readFileSync('docs/ANDROID-SIGNING.md','utf8');
  expect(doc).toContain('ANDROID_KEYSTORE_BASE64');
  expect(doc).toContain('ANDROID_KEY_ALIAS');
  expect(doc).toContain('ANDROID_KEYSTORE_PASSWORD');
  expect(doc).toContain('ANDROID_KEY_PASSWORD');
 });
});
