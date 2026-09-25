import {DEFAULT_ENGINE_CONFIG,normalizeEngineConfig,type EngineConfig} from '../engine/config';
export type ThemeMode='light'|'dark'|'system';export type Language='en'|'fa';
export type AppSettings={version:1;theme:ThemeMode;language:Language;sound:boolean;haptics:boolean;boardTheme:{light:string;dark:string;piece:string};engine:EngineConfig};
export const DEFAULT_SETTINGS:AppSettings={version:1,theme:'system',language:'fa',sound:true,haptics:true,boardTheme:{light:'#f0d9b5',dark:'#b58863',piece:'#111827'},engine:DEFAULT_ENGINE_CONFIG};
const KEY='yasin-chess-settings-v1';
export function validateSettings(input:unknown):input is AppSettings{if(!input||typeof input!=='object')return false;const x=input as Partial<AppSettings>;return x.version===1&&(x.theme==='light'||x.theme==='dark'||x.theme==='system')&&(x.language==='en'||x.language==='fa')&&typeof x.sound==='boolean'&&typeof x.haptics==='boolean'&&Boolean(x.boardTheme)&&Boolean(x.engine)}
export function loadSettings():AppSettings{if(typeof localStorage==='undefined')return DEFAULT_SETTINGS;try{const raw=localStorage.getItem(KEY);if(!raw)return DEFAULT_SETTINGS;const x=JSON.parse(raw);return validateSettings(x)?{...DEFAULT_SETTINGS,...x,engine:normalizeEngineConfig(x.engine)}:DEFAULT_SETTINGS}catch{return DEFAULT_SETTINGS}}
export function saveSettings(patch:Partial<AppSettings>):AppSettings{const next={...loadSettings(),...patch,version:1};if(patch.engine)next.engine=normalizeEngineConfig(patch.engine);if(typeof localStorage!=='undefined')localStorage.setItem(KEY,JSON.stringify(next));return next}
