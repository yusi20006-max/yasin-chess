import {fromFEN} from './board';import {importPGN} from './pgnImport';
export function validateFENInput(fen:string){try{fromFEN(fen);return {valid:true}}catch(e){return {valid:false,error:e instanceof Error?e.message:'Invalid FEN'}}}
export function validatePGNInput(pgn:string){try{importPGN(pgn);return {valid:true}}catch(e){return {valid:false,error:e instanceof Error?e.message:'Invalid PGN'}}}
