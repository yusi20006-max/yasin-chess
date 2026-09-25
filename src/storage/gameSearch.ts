import {getGameHistory,type StoredGame} from './history';
export async function searchGames(query=''):Promise<StoredGame[]>{const games=await getGameHistory();const q=query.trim().toLowerCase();return q?games.filter(g=>g.id.toLowerCase().includes(q)||g.startFEN.toLowerCase().includes(q)):games}
export async function recentGames(limit=50):Promise<StoredGame[]>{return (await getGameHistory()).sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,Math.max(0,limit))}
