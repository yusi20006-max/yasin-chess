import {fromFEN,toFEN} from '../core/board';import type {Position,PieceType,Color} from '../core/types';
export function createPositionEditor(fen:string){const position=fromFEN(fen);return {get:()=>position,set:(square:number,piece:{color:Color;type:PieceType}|null)=>{position.board[square]=piece},fen:()=>toFEN(position)}}
