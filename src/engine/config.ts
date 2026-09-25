import type {DifficultyId} from './difficulty';
export type EngineConfig={depth:number;timeMs:number;nodeLimit:number;difficulty:DifficultyId;useTranspositionTable:boolean;useOpeningBook:boolean;useQuiescence:boolean};
export const DEFAULT_ENGINE_CONFIG:EngineConfig={depth:3,timeMs:1000,nodeLimit:0,difficulty:'beginner',useTranspositionTable:true,useOpeningBook:true,useQuiescence:true};
export function normalizeEngineConfig(input:Partial<EngineConfig>={}):EngineConfig{
 const depth=Math.min(20,Math.max(1,Math.floor(input.depth??DEFAULT_ENGINE_CONFIG.depth)));
 const timeMs=Math.max(0,Math.floor(input.timeMs??DEFAULT_ENGINE_CONFIG.timeMs));
 const nodeLimit=Math.max(0,Math.floor(input.nodeLimit??DEFAULT_ENGINE_CONFIG.nodeLimit));
 const difficulty=input.difficulty??DEFAULT_ENGINE_CONFIG.difficulty;
 if(!['beginner','intermediate','advanced','master','custom'].includes(difficulty))throw new Error('Invalid engine difficulty');
 if(!Number.isFinite(depth)||!Number.isFinite(timeMs)||!Number.isFinite(nodeLimit))throw new Error('Invalid engine configuration');
 return {...DEFAULT_ENGINE_CONFIG,...input,depth,timeMs,nodeLimit,difficulty};
}
export function validateEngineConfig(input:Partial<EngineConfig>):string[]{const e:string[]=[];if(input.depth!==undefined&&(!Number.isInteger(input.depth)||input.depth<1||input.depth>20))e.push('depth must be an integer from 1 to 20');if(input.timeMs!==undefined&&(!Number.isInteger(input.timeMs)||input.timeMs<0))e.push('timeMs must be a non-negative integer');if(input.nodeLimit!==undefined&&(!Number.isInteger(input.nodeLimit)||input.nodeLimit<0))e.push('nodeLimit must be a non-negative integer');return e}
