import {CURRENT_SCHEMA_VERSION,migrate} from './migrations';

const DB_NAME='yasin-chess';
const VERSION=CURRENT_SCHEMA_VERSION;
const STORE='games';

function openDB():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  const r=indexedDB.open(DB_NAME,VERSION);
  r.onupgradeneeded=event=>{
   const db=r.result;
   if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'});
   const tx=r.transaction;
   const store=tx?.objectStore(STORE);
   if(!store)return;
   const cursor=store.openCursor();
   cursor.onsuccess=()=>{const current=cursor.result;if(!current)return;try{const value=current.value;if(value&&typeof value==='object'&&'id' in value)current.update(migrate(value,value.schemaVersion??(event as IDBVersionChangeEvent).oldVersion));current.continue()}catch(error){tx?.abort();reject(error)}};
  };
  r.onsuccess=()=>resolve(r.result);
  r.onerror=()=>reject(r.error);
 });
}

export async function putGame<T extends {id:string}>(game:T){
 const db=await openDB();
 return new Promise<void>((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(game);tx.oncomplete=()=>{db.close();res()};tx.onerror=()=>{db.close();rej(tx.error)}});
}
export async function getGame<T>(id:string){
 const db=await openDB();
 return new Promise<T|undefined>((res,rej)=>{const r=db.transaction(STORE).objectStore(STORE).get(id);r.onsuccess=()=>{db.close();res(r.result as T|undefined)};r.onerror=()=>{db.close();rej(r.error)}});
}
export async function listGames<T>(){
 const db=await openDB();
 return new Promise<T[]>((res,rej)=>{const r=db.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>{db.close();res(r.result as T[])};r.onerror=()=>{db.close();rej(r.error)}});
}
export async function deleteGame(id:string){
 const db=await openDB();
 return new Promise<void>((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=()=>{db.close();res()};tx.onerror=()=>{db.close();rej(tx.error)}});
}
