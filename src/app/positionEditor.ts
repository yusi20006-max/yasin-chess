import {fromFEN,toFEN,emptyBoard,sq} from '../core/board';
import type {Color,Piece,PieceType,Position} from '../core/types';

export type EditorState={board:(Piece|null)[];turn:Color;castling:Position['castling'];ep:Position['ep']};

export const EDITOR_PIECES:PieceType[]=['p','n','b','r','q','k'];

export function editorFromPosition(position:Position):EditorState{
  return {board:[...position.board],turn:position.turn,castling:{...position.castling},ep:position.ep};
}

export function editorInitial():EditorState{
  return editorFromPosition(fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
}

export function editorToPosition(state:EditorState):Position{
  return {board:[...state.board],turn:state.turn,castling:{...state.castling},ep:state.ep,halfmove:0,fullmove:1};
}

export function validateEditorState(state:EditorState):string|null{
  const whiteKings=state.board.filter(x=>x?.color==='w'&&x.type==='k').length;
  const blackKings=state.board.filter(x=>x?.color==='b'&&x.type==='k').length;
  if(whiteKings!==1||blackKings!==1)return 'Exactly one king per side is required';
  try{fromFEN(toFEN(editorToPosition(state)));return null}catch(error){return error instanceof Error?error.message:'Invalid position'};
}

export function editorFEN(state:EditorState):string{return toFEN(editorToPosition(state));}

export function setEditorPiece(state:EditorState,square:number,piece:Piece|null):EditorState{
  const board=[...state.board];board[square]=piece;
  const castling={...state.castling};
  if(square===sq(4,0)||square===sq(7,0)||square===sq(0,0)){castling.wK=square===sq(7,0)?castling.wK:false;castling.wQ=square===sq(0,0)?castling.wQ:false;}
  if(square===sq(4,7)||square===sq(7,7)||square===sq(0,7)){castling.bK=square===sq(7,7)?castling.bK:false;castling.bQ=square===sq(0,7)?castling.bQ:false;}
  return {...state,board,castling};
}

export function clearEditor(state:EditorState):EditorState{return {...editorInitial(),board:Array(64).fill(null)};}
