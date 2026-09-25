import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

if (existsSync('android')) {
  console.log('Android platform already exists; syncing instead.');
  execFileSync('npx', ['cap', 'sync', 'android'], { stdio: 'inherit' });
} else {
  console.log('Generating the Capacitor Android platform.');
  execFileSync('npx', ['cap', 'add', 'android'], { stdio: 'inherit' });
}
