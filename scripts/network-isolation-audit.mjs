import { readFileSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');
const required = ["default-src 'self'", "connect-src 'self'", "object-src 'none'"];
for (const token of required) if (!html.includes(token)) throw new Error(`Missing CSP directive: ${token}`);
if (html.includes('connect-src *')) throw new Error('Wildcard network access is forbidden');
console.log('Network isolation policy present.');
