import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {chooseMove} from '../src/engine/minimax';
import {initialPosition,toFEN} from '../src/core/board';
import {undoTurnPair,redoTurnPair} from '../src/app/undoTurn';

/** ChessGame-only deterministic reproduction + helper under test. */
describe('Human-vs-AI undo semantics',()=>{
 const fullTurns=(n:number)=>{
  const g=new ChessGame();
  for(let i=0;i<n;i++){g.play(chooseMove(g.position,2)!);g.play(chooseMove(g.position,2)!);}
  return g;
 };
 it('single-ply ChessGame.undo is correct (removes exactly one ply)',()=>{
  const g=fullTurns(2);
  expect(g.history).toHaveLength(4);
  expect(g.undo()).toBe(true);
  expect(g.history).toHaveLength(3);
  expect(g.future).toHaveLength(1);
  // Removing one ply leaves Black to move -> App's AI effect refires (the bug).
  expect(g.position.turn).toBe('b');
 });
 it('one complete turn: paired undo reaches initial position with White to move',()=>{
  const g=fullTurns(1);
  expect(g.history).toHaveLength(2);
  expect(undoTurnPair(g,'human-vs-ai')).toBe(2);
  expect(g.history).toHaveLength(0);
  expect(g.future).toHaveLength(2);
  expect(g.position.turn).toBe('w');
  expect(toFEN(g.position)).toBe(toFEN(initialPosition()));
 });
 it('two complete turns: one undo returns to before the last White move, White to move',()=>{
  const g=fullTurns(2);
  expect(g.history).toHaveLength(4);
  const sans=g.history.map(h=>h.san);
  expect(undoTurnPair(g,'human-vs-ai')).toBe(2);
  expect(g.history.map(h=>h.san)).toEqual(sans.slice(0,2));
  // future holds plies most-recently-undone first (LIFO), i.e. reversed tail.
  expect(g.future.map(h=>h.san)).toEqual(sans.slice(2).reverse());
  expect(g.position.turn).toBe('w');
 });
 it('undo while the AI reply is still pending removes only the White move',()=>{
  const g=new ChessGame();
  g.play(chooseMove(g.position,2)!);
  expect(g.position.turn).toBe('b');
  expect(undoTurnPair(g,'human-vs-ai')).toBe(1);
  expect(g.history).toHaveLength(0);
  expect(g.position.turn).toBe('w');
  expect(toFEN(g.position)).toBe(toFEN(initialPosition()));
 });
 it('human-vs-human undo stays single-ply',()=>{
  const g=fullTurns(2);
  expect(undoTurnPair(g,'human-vs-human')).toBe(1);
  expect(g.history).toHaveLength(3);
  expect(g.position.turn).toBe('b');
 });
 it('paired undo returns 0 on an empty history',()=>{
  const g=new ChessGame();
  expect(undoTurnPair(g,'human-vs-ai')).toBe(0);
  expect(g.history).toHaveLength(0);
  expect(g.future).toHaveLength(0);
 });
 it('REDO after paired undo restores both plies coherently (Black-to-move, 4 plies)',()=>{
  const g=fullTurns(2);
  const sans=g.history.map(h=>h.san);
  const fenBefore=g.position;
  undoTurnPair(g,'human-vs-ai');
  expect(g.history).toHaveLength(2);
  // Redo both plies (App performs one redo per future entry until White to move).
  expect(g.redo()).toBe(true);
  expect(g.position.turn).toBe('b');   // <-- this is why a naive redo is unsafe:
  expect(g.history).toHaveLength(3);   //     the AI effect would fire here.
  expect(g.redo()).toBe(true);
  expect(g.history).toHaveLength(4);
  expect(g.position.turn).toBe('w');
  expect(g.history.map(h=>h.san)).toEqual(sans);
  expect(g.future).toHaveLength(0);
  expect(toFEN(g.position)).toBe(toFEN(fenBefore));
 });
 it('REPLAYING the restored AI ply destroys the Redo chain (demonstrates the hazard)',()=>{
  const g=fullTurns(2);
  undoTurnPair(g,'human-vs-ai');
  expect(g.future).toHaveLength(2);
  g.redo();                              // history 3, Black to move
  expect(g.future).toHaveLength(1);
  const stale=chooseMove(g.position,2);  // what a re-fired AI effect computes NOW
  g.play(stale!);                        // AI effect commits; play() clears future
  // play() clears future: the pending Redo entry is silently destroyed.
  expect(g.future).toHaveLength(0);
  expect(g.redo()).toBe(false);
 });
 it('REDO pair after paired UNDO never lands on Black-to-move (no AI re-fire)',()=>{
  const g=fullTurns(2);
  const sans=g.history.map(h=>h.san);
  const fenBefore=toFEN(g.position);
  undoTurnPair(g,'human-vs-ai');
  expect(g.position.turn).toBe('w');
  expect(redoTurnPair(g,'human-vs-ai')).toBe(2);
  // A single Redo restores the full turn: White to move, future drained.
  expect(g.position.turn).toBe('w');
  expect(g.future).toHaveLength(0);
  expect(g.history.map(h=>h.san)).toEqual(sans);
  expect(toFEN(g.position)).toBe(fenBefore);
 });
 it('human-vs-human redo stays single-ply',()=>{
  const g=fullTurns(2);
  undoTurnPair(g,'human-vs-human');
  expect(g.history).toHaveLength(3);
  expect(redoTurnPair(g,'human-vs-human')).toBe(1);
  expect(g.history).toHaveLength(4);
  expect(g.position.turn).toBe('w');
 });
 it('invalidates the AI request sequence so a stale result cannot commit (contract)',()=>{
  // Mirrors App's request-ref contract: an in-flight AI request captures the
  // counter at dispatch time; Undo/Redo bump it before mutating game state,
  // so the late result fails BOTH guards and must not touch game/thinking.
  const requestRef={current:0};
  const dispatch=()=>requestRef.current;          // request captured by the effect
  const pending=dispatch();                        // AI result still in flight
  expect(pending).toBe(0);
  // --- user presses Undo while the AI request is pending ---
  requestRef.current++;                            // invalidate before state change
  expect(pending).not.toBe(requestRef.current);    // request-guard-fail
  const g=fullTurns(1);
  const staleSnapshot=g;                           // the snapshot the AI effect holds
  const next=g.clone();                            // App's pattern: mutate a clone
  undoTurnPair(next,'human-vs-ai');
  expect(next).not.toBe(staleSnapshot);            // game-guard-fail (identity check)
  expect(next.position.turn).toBe('w');            // no stale AI move was committed
  expect(next.history).toHaveLength(0);
  expect(staleSnapshot.history).toHaveLength(2);   // original untouched by stale guard
 });
});