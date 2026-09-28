import {existsSync,readFileSync} from 'node:fs';

const pkg=JSON.parse(readFileSync('package.json','utf8'));
const cap=readFileSync('capacitor.config.ts','utf8');
const html=readFileSync('index.html','utf8');
const manifest=JSON.parse(readFileSync('public/manifest.webmanifest','utf8'));
const sw=readFileSync('public/sw.js','utf8');

const checks=[
 [pkg.name==='yasin-chess','package identity'],
 [/^\d+\.\d+\.\d+$/.test(pkg.version),'semantic version'],
 [cap.includes("appId: 'com.yasin.chess'"),'Capacitor application id'],
 [cap.includes("webDir: 'dist'"),'Capacitor web directory'],
 [cap.includes('cleartext: false'),'cleartext disabled'],
 [html.includes("connect-src 'self'"),'offline CSP'],
 [manifest.display==='standalone','standalone manifest'],
 [manifest.scope==='/'&&manifest.start_url==='/','manifest scope/start'],
 [Array.isArray(manifest.icons)&&manifest.icons.length>0,'manifest icon'],
 [sw.includes("self.addEventListener('install'"),'service worker install'],
 [sw.includes("self.addEventListener('activate'"),'service worker activate'],
 [sw.includes("request.mode==='navigate'"),'offline navigation fallback'],
 [existsSync('docs/ANDROID-SIGNING.md'),'Android signing documentation']
];
const failed=checks.filter(([ok])=>!ok).map(([,name])=>name);
if(failed.length)throw new Error('Android final audit failed: '+failed.join(', '));
console.log('Android final audit passed.');
