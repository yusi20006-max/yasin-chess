import {deleteGame,listGames} from './db';import {DEFAULT_SETTINGS,saveSettings} from '../app/settings';
const STATS_KEY='yasin-chess-statistics-v1';const AI_STATS_KEY='yasin-chess-ai-statistics-v1';
export async function resetActiveGame(){await deleteGame('active')}
export async function resetHistory(){for(const g of await listGames<{id:string}>())if(g.id!=='active')await deleteGame(g.id)}
export function resetSettings(){if(typeof localStorage!=='undefined')localStorage.removeItem('yasin-chess-settings-v1');return saveSettings(DEFAULT_SETTINGS)}
export function resetStatistics(){if(typeof localStorage!=='undefined')localStorage.removeItem(STATS_KEY)}
export async function resetAll(){for(const g of await listGames<{id:string}>())await deleteGame(g.id);if(typeof localStorage!=='undefined'){localStorage.removeItem('yasin-chess-settings-v1');localStorage.removeItem(STATS_KEY);localStorage.removeItem(AI_STATS_KEY)}}
