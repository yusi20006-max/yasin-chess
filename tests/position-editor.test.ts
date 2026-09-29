import {describe,expect,it} from 'vitest';
import {editorFEN,editorInitial,editorToPosition,validateEditorState,setEditorPiece} from '../src/app/positionEditor';

describe('position editor',()=>{
 it('starts from the standard position and exports FEN',()=>{
  const state=editorInitial();
  expect(editorFEN(state)).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
 });
 it('requires exactly one king per side',()=>{
  const state=editorInitial();
  state.board[4]=null;
  expect(validateEditorState(state)).toContain('Exactly one king');
 });
 it('can place and remove pieces without mutating the original state',()=>{
  const state=editorInitial();
  const next=setEditorPiece(state,0,{color:'w',type:'q'});
  expect(next.board[0]).toEqual({color:'w',type:'q'});
  expect(state.board[0]).toEqual({color:'w',type:'r'});
  const cleared=setEditorPiece(next,0,null);
  expect(cleared.board[0]).toBeNull();
 });
 it('produces a position consumable by the game engine',()=>{
  expect(editorToPosition(editorInitial()).board).toHaveLength(64);
 });
});
