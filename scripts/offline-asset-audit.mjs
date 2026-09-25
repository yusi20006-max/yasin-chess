import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = 'dist';
if (!existsSync(join(root, 'index.html'))) throw new Error('dist/index.html is missing; build first');

const html = readFileSync(join(root, 'index.html'), 'utf8');
const remote = [...html.matchAll(/(?:src|href)=(["'])(https?:\/\/[^"']+)\1/g)].map(m => m[2]);
if (remote.length) throw new Error(`Remote runtime assets found: ${remote.join(', ')}`);

const assets = [];
function walk(dir) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, name.name);
    if (name.isDirectory()) walk(path);
    else assets.push(path);
  }
}
walk(root);
if (!assets.length) throw new Error('No bundled assets found');
console.log(`Offline asset audit passed: ${assets.length} bundled files, no remote runtime URLs.`);
