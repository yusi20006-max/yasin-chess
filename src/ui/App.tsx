import {useEffect,useMemo,useState} from 'react';
import {ChessGame} from '../core/game';
import {legalMovesFrom} from '../core/moves';
import {difficulty,DIFFICULTIES,type DifficultyId} from '../engine/difficulty';
import {chooseMove} from '../engine/minimax';
import {squareName} from '../core/board';
import type {Square} from '../core/types';
import AppShell from './AppShell';
import GameLayout from './GameLayout';
import ChessBoard from './ChessBoard';
import Piece from './Piece';
import './styles.css';
import {useOnlineStatus} from './useOnlineStatus';
import {DEFAULT_BOARD_THEME,loadBoardTheme,saveBoardTheme} from './boardSettings';

const glyph={w:{k:'♔',q:'♕',r:'♖',b:'♗',n:'♘',p:'♙'},b:{k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'}};

export default function App(){
 const [game,setGame]=useState(()=>new ChessGame());
 const [selected,setSelected]=useState<Square|null>(null);
 const [level,setLevel]=useState<DifficultyId>('beginner');
 const [customDepth,setCustomDepth]=useState(8);
 const [last,setLast]=useState(''); const [theme,setTheme]=useState(()=>loadBoardTheme()); const [orientation,setOrientation]=useState<'white'|'black'>('white');
 const online=useOnlineStatus();
 const d=useMemo(()=>difficulty(level,{depth:level==='custom'?customDepth:undefined}),[level,customDepth]);

 useEffect(()=>{if(game.position.turn!=='b'||d.id==='custom'||d.depth<=0)return;const snapshot=game;const timer=window.setTimeout(()=>{const m=chooseMove(snapshot.position,d.depth);if(!m)return;setGame(current=>{if(current!==snapshot)return current;const next=snapshot.clone();const san=next.play(m);setLast(san);return next;});},80);return()=>window.clearTimeout(timer)},[game,d]);

 const moveFromTo=(from:Square,to:Square)=>{const opts=legalMovesFrom(game.position,from).filter(m=>m.to===to);if(!opts.length)return;try{const next=game.clone();const san=next.play(opts.find(m=>m.promotion==='q')??opts[0]);setLast(san);setSelected(null);setGame(next)}catch{setSelected(null)}};
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

 const lastMove=game.history.length?game.history[game.history.length-1].move:undefined;
 const checkSquare=game.status()==='check'||game.status()==='checkmate'?game.position.board.findIndex(p=>p?.type==='k'&&p.color===game.position.turn):null;
 const highlights=new Set(selected===null?[]:legalMovesFrom(game.position,selected).map(m=>m.to));
 const board=<ChessBoard position={game.position} selected={selected} highlights={highlights} onSquareClick={click} onSquareDrag={moveFromTo} orientation={orientation} lastMove={lastMove} checkSquare={checkSquare} renderPiece={s=>{const pc=game.position.board[s];return pc?<Piece piece={pc}/>:null;}}/>;
 const playerPanels=<div className="player-panels"><div className={`player-card ${game.position.turn==='w'?'active':''}`}><b>White</b><span>{game.position.turn==='w'?'Your turn':'Waiting'}</span></div><div className={`player-card ${game.position.turn==='b'?'active':''}`}><b>Black · AI</b><span>{game.position.turn==='b'?'Thinking':'Waiting'}</span></div></div>;
 const panel=<><div className="status">وضعیت: <b>{game.status()}</b></div><div className="meta">سطح: {d.label}<br/>Depth: {d.depth} • Elo: {d.elo}</div><h2>حرکت‌ها</h2><ol className="move-list">{game.history.map((h,i)=><li key={i} className={i===game.history.length-1?"current-move":""}><span>{Math.floor(i/2)+1}{i%2===0?".":"..."}</span><b>{h.san}</b></li>)}</ol><div className="controls"><button onClick={undo} disabled={!game.history.length}>Undo</button><button onClick={redo} disabled={!game.future.length}>Redo</button><button onClick={fresh}>New Game</button></div><div className="last">آخرین حرکت: {last||'—'}</div><div className="pgn">{game.pgn()}</div></>;

 return <AppShell sidebar={<><button className="theme-toggle" type="button" onClick={()=>{const next=theme.light===DEFAULT_BOARD_THEME.light?{light:'#d8e8c8',dark:'#6b8f71',piece:'#111827'}:DEFAULT_BOARD_THEME;setTheme(next);saveBoardTheme(next)}}>Theme</button><select value={level} onChange={e=>setLevel(e.target.value as DifficultyId)} aria-label="AI difficulty">{DIFFICULTIES.map(x=><option key={x.id} value={x.id}>{x.label} — Elo ~{x.elo}</option>)}</select>}>
  <style>{".chess-board{--board-light:"+theme.light+";--board-dark:"+theme.dark+"}.piece{color:"+theme.piece+"}"}</style>
  {level==='custom'&&<div className="custom-depth"><label>Depth <input type="number" min="1" max="20" value={customDepth} onChange={e=>setCustomDepth(Number(e.target.value))}/></label></div>}
  <button className="view-toggle" type="button" onClick={()=>setOrientation(x=>x==="white"?"black":"white")}>↔ Flip</button><div className={`runtime-banner ${online?'online':'offline'}`} role="status">{online?'Online':'Offline — بازی محلی ادامه دارد'}</div>
  <GameLayout board={<>{playerPanels}{board}</>} panel={panel}/>
 </AppShell>;
}
