import {cpSync,existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const pkgRoot=join(root,'node_modules','stockfish');
const sourceDir=join(pkgRoot,'src');
const names=['stockfish-19-lite-single.js','stockfish-19-lite-single.wasm'];
const outDir=join(root,'public','engine');
if(!existsSync(sourceDir))throw new Error('Stockfish dependency is not installed; run npm install first.');
mkdirSync(outDir,{recursive:true});
for(const name of names){
 const source=join(sourceDir,name);
 if(!existsSync(source))throw new Error(`Missing Stockfish asset: ${name}`);
 cpSync(source,join(outDir,name));
}
const license=join(pkgRoot,'Copying.txt');
if(existsSync(license))cpSync(license,join(outDir,'stockfish-COPYING.txt'));
const manifest={
 engine:'Stockfish.js',
 version:'19.0.0',
 build:'lite-single',
 license:'GPL-3.0',
 source:'https://github.com/nmrugg/stockfish.js/tree/v19.0.0',
 files:names
};
writeFileSync(join(outDir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Prepared Stockfish 19 lite single-threaded assets.');
