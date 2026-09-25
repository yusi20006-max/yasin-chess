import {fromFEN,toFEN} from '../core/board';
export function validateFEN(fen:string){try{fromFEN(fen);return {valid:true,fen:toFEN(fromFEN(fen))}}catch(e){return {valid:false,error:e instanceof Error?e.message:'Invalid FEN'}}}
