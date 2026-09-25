import {listGames} from './db';import {loadSettings} from '../app/settings';import type {PersistedGame} from './statistics';
export const BACKUP_VERSION=1;
export type Backup={format:'yasin-chess-backup';version:1;createdAt:number;games:PersistedGame[];settings:ReturnType<typeof loadSettings>};
export async function createBackup():Promise<Backup>{return {format:'yasin-chess-backup',version:BACKUP_VERSION,createdAt:Date.now(),games:await listGames<PersistedGame>(),settings:loadSettings()}}
export function serializeBackup(b:Backup){return JSON.stringify(b)}
export function downloadBackup(b:Backup){const blob=new Blob([serializeBackup(b)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='yasin-chess-backup.json';a.click();URL.revokeObjectURL(url)}
