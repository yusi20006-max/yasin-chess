import {readFileSync} from 'node:fs';

const pkg=JSON.parse(readFileSync('package.json','utf8'));
const cap=readFileSync('capacitor.config.ts','utf8');

const expectedId='com.yasin.chess';
if(cap.match(/appId:\s*['"]([^'"]+)['"]/)?.[1]!==expectedId) throw new Error('Capacitor appId mismatch');
if(cap.match(/appName:\s*['"]([^'"]+)['"]/)?.[1]!=='Yasin Chess') throw new Error('Capacitor appName mismatch');
if(cap.match(/webDir:\s*['"]([^'"]+)['"]/)?.[1]!=='dist') throw new Error('Capacitor webDir must remain dist');
if(pkg.name!=='yasin-chess') throw new Error('Package identity mismatch');
if(!/^\d+\.\d+\.\d+$/.test(pkg.version)) throw new Error('Package version must be semver');
console.log('Android identity contract passed.');
