import { readFileSync } from 'node:fs';
const cap=readFileSync('capacitor.config.ts','utf8');
if(cap.includes('server: {') && cap.includes('url:')) throw new Error('Capacitor server.url must remain unset for standalone offline runtime');
const html=readFileSync('index.html','utf8');
if(!html.includes("connect-src 'self'")) throw new Error('Offline CSP is missing');
console.log('Android offline contract passed.');
