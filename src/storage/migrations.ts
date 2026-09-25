export const CURRENT_SCHEMA_VERSION=2;
export type Migration<T=any>=(value:T)=>T;
export function migrate<T extends Record<string,any>>(value:T,version=(value.schemaVersion??1)):T{let v={...value};if(version<2){v={...v,schemaVersion:2,updatedAt:v.updatedAt??Date.now()}}return v}
