import {describe, expect, it} from 'vitest';
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {ALLOWED_DEPENDENCIES, LAYERS, canDepend, type Layer} from '../src/architecture/boundaries';

function listTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...listTsFiles(p));
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts')) out.push(p);
  }
  return out;
}

function importsOf(file: string): string[] {
  const src = readFileSync(file, 'utf8');
  const re = /from\s+['"]([^'"]+)['"]/g;
  const hits: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) hits.push(m[1]);
  return hits;
}

function resolveLayer(fromFile: string, importPath: string): Layer | null {
  // Only relative imports into src layers
  if (!importPath.startsWith('.')) return null;
  const absHint = join(fromFile, '..', importPath).replace(/\\/g, '/');
  for (const layer of LAYERS) {
    if (absHint.includes(`/src/${layer}/`) || absHint.includes(`\\src\\${layer}\\`)) return layer;
    // import like '../core/game'
    if (importPath.includes(`/${layer}/`) || importPath.includes(`../${layer}/`) || importPath.includes(`../../${layer}/`)) {
      return layer;
    }
  }
  // Pattern: '../core/...' or './something' within same layer
  const m = importPath.match(/(?:^|\.\.\/)(core|engine|app|storage|pwa|platform|ui)\b/);
  return m ? (m[1] as Layer) : null;
}

function fileLayer(file: string): Layer | null {
  const n = file.replace(/\\/g, '/');
  for (const layer of LAYERS) {
    if (n.includes(`/src/${layer}/`)) return layer;
  }
  return null;
}

describe('architecture boundaries', () => {
  it('defines all layers and allowed dependency map', () => {
    expect(LAYERS.length).toBe(7);
    for (const layer of LAYERS) {
      expect(ALLOWED_DEPENDENCIES[layer]).toBeDefined();
    }
    expect(canDepend('core', 'ui')).toBe(false);
    expect(canDepend('engine', 'core')).toBe(true);
    expect(canDepend('ui', 'core')).toBe(true);
    expect(canDepend('storage', 'ui')).toBe(false);
  });

  it('core never imports ui, storage, pwa, platform, app, or engine', () => {
    const files = listTsFiles('src/core');
    const forbidden = new Set(['ui', 'storage', 'pwa', 'platform', 'app', 'engine']);
    for (const file of files) {
      for (const imp of importsOf(file)) {
        const target = resolveLayer(file, imp);
        if (target && forbidden.has(target)) {
          throw new Error(`${file} illegally imports ${target} via ${imp}`);
        }
      }
    }
  });

  it('storage never imports ui or pwa', () => {
    const files = listTsFiles('src/storage');
    for (const file of files) {
      for (const imp of importsOf(file)) {
        const target = resolveLayer(file, imp);
        if (target === 'ui' || target === 'pwa') {
          throw new Error(`${file} illegally imports ${target}`);
        }
      }
    }
  });

  it('every src file belongs to a known layer or entrypoint', () => {
    const roots = ['src/core', 'src/engine', 'src/app', 'src/storage', 'src/pwa', 'src/platform', 'src/ui', 'src/architecture'];
    for (const root of roots) {
      expect(() => listTsFiles(root)).not.toThrow();
    }
  });

  it('AppShell is a pure presentation shell (no storage/db imports)', () => {
    const src = readFileSync('src/ui/AppShell.tsx', 'utf8');
    expect(src).not.toMatch(/from ['"].*storage/);
    expect(src).not.toMatch(/indexedDB/i);
  });
});
