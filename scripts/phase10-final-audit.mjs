import {readFileSync,existsSync} from 'node:fs';

const read=p=>readFileSync(p,'utf8');
const checks=[
 ['i18n module exists',existsSync('src/app/i18n.ts')],
 ['fa/en catalogs exist',(()=>{const s=read('src/app/i18n.ts');return s.includes('fa:')&&s.includes('en:')})()],
 ['language persistence is wired',read('src/ui/App.tsx').includes('setAppLocale')&&read('src/ui/App.tsx').includes('saveSettings({language:locale})')],
 ['document direction is wired',read('src/app/i18n.ts').includes('document.documentElement.dir')],
 ['board exposes selection semantics',read('src/ui/ChessBoard.tsx').includes('aria-selected')],
 ['board exposes current-move semantics',read('src/ui/ChessBoard.tsx').includes('aria-current')],
 ['keyboard escape contract exists',read('src/ui/ChessBoard.tsx').includes("e.key==='Escape'")],
 ['screen-reader guidance exists',read('src/ui/GameLayout.tsx').includes('chess-game-help')],
 ['UX regression suite exists',existsSync('tests/ux-state-regression.test.ts')],
 ['Android final audit remains present',existsSync('scripts/android-final-audit.mjs')],
];
const failed=checks.filter(([,ok])=>!ok);
for(const [name,ok] of checks)console.log((ok?'PASS ':'FAIL ')+name);
if(failed.length)process.exit(1);
console.log('PHASE10_FINAL_AUDIT_OK');