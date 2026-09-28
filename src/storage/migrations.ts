export const CURRENT_SCHEMA_VERSION=3;
export type Migration<T=any>=(value:T)=>T;

export function migrate<T extends Record<string,any>>(value:T,version=(value.schemaVersion??1)):T{
  if(!Number.isInteger(version)||version<1)throw new Error('Invalid persistence schema version');
  if(version>CURRENT_SCHEMA_VERSION)throw new Error('Unsupported future persistence schema version');
  let v={...value,schemaVersion:version};
  if(version<2){
    v={...v,schemaVersion:2,updatedAt:typeof v.updatedAt==='number'?v.updatedAt:Date.now()};
  }
  if(v.schemaVersion<3){
    v={...v,schemaVersion:3,updatedAt:typeof v.updatedAt==='number'?v.updatedAt:Date.now(),future:Array.isArray(v.future)?v.future:[],keys:Array.isArray(v.keys)?v.keys:[]};
  }
  return v as T;
}
