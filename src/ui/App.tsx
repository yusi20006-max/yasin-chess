import {useEffect,useMemo,useState} from 'react';
import {ChessGame} from '../core/game';
import {legalMovesFrom} from '../core/moves';
import {difficulty,DIFFICULTIES,type DifficultyId} from '../engine/difficulty';
import {chooseMove} from '../engine/minimax';
import {squareName} from '../core/board';
import type {Square} from '../core/types';
import AppShell from './AppShell';
import GameLayout from './GameLayout';
import './styles.css';

const glyph={w:{k:'♔',q:'♕',r:'♖',b:'♗',n:'♘',p:'♙'},b:{k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'}};

export default function App(){
 const [game,setGame]=useState(()=>new ChessGame());
 const [selected,setSelected]=useState<Square|null>(null);
 const [level,setLevel]=useState<DifficultyId>('beginner');
 const [customDepth,setCustomDepth]=useState(8);
 const [last,setLast]=useState('');
 const d=useMemo(()=>difficulty(level,{depth:level==='custom'?customDepth:undefined}),[level,customDepth]);

 useEffect(()=>{if(game.position.turn!=='b'||d.id==='custom'||d.depth<=0)return;const snapshot=game;const timer=window.setTimeout(()=>{const m=chooseMove(snapshot.position,d.depth);if(!m)return;setGame(current=>{if(current!==snapshot)return current;const next=snapshot.clone();const san=next.play(m);setLast(san);return next;});},80);return()=>window.clearTimeout(timer)},[game,d]);

 const click=(s:Square)=>{
  const pc=game.position.board[s];
  if(selected!==null){
   const opts=legalMovesFrom(game.position,selected).filter(m=>m.to===s);
   if(opts.length){try{const next=game.clone();const san=next.play(opts.find(m=>m.promotion==='q')??opts[0]);setLast(san);setSelected(null);setGame(next)}catch{setSelected(null)}return}
  }
  if(pc?.color===game.position.turn)setSelected(s);
 };
 const undo=()=>{const next=game.clone();if(next.undo())setGame(next);setSelected(null)};
 const redo=()=>{const next=game.clone();if(next.redo())setGame(next);setSelected(null)};
 const fresh=()=>{setGame(new ChessGame());setSelected(null);setLast('')};

 const board=<div className="board">{game.position.board.map((pc,i)=>{const rank=Math.floor(i/8),file=i%8;const hi=selected!==null&&legalMovesFrom(game.position,selected).some(m=>m.to===i);return <button aria-label={squareName(i)} key={i} className={`square ${(rank+file)%2?'dark':'light'} ${hi?'hint':''} ${selected===i?'selected':''}`} onClick={()=>click(i)}>{pc&&glyph[pc.color][pc.type]}</button>})}</div>;
 const panel=<><div className="status">وضعیت: <b>{game.status()}</b></div><div className="meta">سطح: {d.label}<br/>Depth: {d.depth} • Elo: {d.elo}</div><h2>حرکت‌ها</h2><ol>{game.history.map((h,i)=><li key={i}>{Math.floor(i/2)+1}{i%2===0?'. ': '... '}{h.san}</li>)}</ol><div className="controls"><button onClick={undo}>Undo</button><button onClick={redo}>Redo</button><button onClick={fresh}>New</button></div><div className="last">آخرین حرکت: {last||'—'}</div><div className="pgn">{game.pgn()}</div></>;

 return <AppShell sidebar={<select value={level} onChange={e=>setLevel(e.target.value as DifficultyId)} aria-label="AI difficulty">{DIFFICULTIES.map(x=><option key={x.id} value={x.id}>{x.label} — Elo ~{x.elo}</option>)}</select>}>
  {level==='custom'&&<div className="custom-depth"><label>Depth <input type="number" min="1" max="20" value={customDepth} onChange={e=>setCustomDepth(Number(e.target.value))}/></label></div>}
  <GameLayout board={board} panel={panel}/>
 </AppShell>;
}
