import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root='dist';
if(!existsSync(root)) throw new Error('Build first');
let total=0;
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())walk(p);else total+=statSync(p).size}}
walk(root);
const max=3*1024*1024;
console.log(JSON.stringify({totalBytes:total,maxBytes:max,withinBudget:total<=max},null,2));
if(total>max)process.exit(1);
