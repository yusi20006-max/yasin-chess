import {useEffect,useMemo,useRef,useState} from 'react';
import {ChessGame} from '../core/game';
import {legalMovesFrom} from '../core/moves';
import {difficulty,DIFFICULTIES,type DifficultyId} from '../engine/difficulty';
import {chooseMove} from '../engine/minimax';
import {squareName} from '../core/board';
import type {Promotion,Square,Move} from '../core/types';
import AppShell from './AppShell';
import GameLayout from './GameLayout';
import ChessBoard from './ChessBoard';
import Piece from './Piece';
import './styles.css';
import './theme.css';
import {loadSettings,saveSettings,type ThemeMode} from '../app/settings';
import {setLocale,t,type Locale} from '../i18n';
import {playSound} from './sound';import {haptic} from './haptics';
import './portrait.css';import './landscape.css';import './safeArea.css';
import {useOnlineStatus} from './useOnlineStatus';
import {DEFAULT_BOARD_THEME,loadBoardTheme,saveBoardTheme} from './boardSettings';

const glyph={w:{k:'♔',q:'♕',r:'♖',b:'♗',n:'♘',p:'♙'},b:{k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'}};

export default function App(){
 const [game,setGame]=useState(()=>new ChessGame());
 const [selected,setSelected]=useState<Square|null>(null);
 const [level,setLevel]=useState<DifficultyId>('beginner');
 const [customDepth,setCustomDepth]=useState(8);
 const [last,setLast]=useState(''); const [promotion,setPromotion]=useState<{moves:Move[]}|null>(null); const [theme,setTheme]=useState(()=>loadBoardTheme());
 const [themeMode,setThemeMode]=useState<ThemeMode>(()=>loadSettings().theme);
 const [locale,setAppLocale]=useState<Locale>(()=>loadSettings().language); const [orientation,setOrientation]=useState<'white'|'black'>('white');
 const [thinking,setThinking]=useState(false); const [thinkingStarted,setThinkingStarted]=useState(0); const [thinkingElapsed,setThinkingElapsed]=useState(0); const requestRef=useRef(0);
 const online=useOnlineStatus();
 useEffect(()=>{setLocale(locale)},[locale]);
 useEffect(()=>{const root=document.documentElement;const apply=()=>{const mode=themeMode==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):themeMode;root.dataset.theme=mode};apply();if(themeMode!=='system')return;const mq=window.matchMedia('(prefers-color-scheme: dark)');mq.addEventListener('change',apply);return()=>mq.removeEventListener('change',apply)},[themeMode]);
 const d=useMemo(()=>difficulty(level,{depth:level==='custom'?customDepth:undefined}),[level,customDepth]);

 useEffect(()=>{if(!thinking)return;const id=window.setInterval(()=>setThinkingElapsed(Math.max(0,Date.now()-thinkingStarted)),250);return()=>window.clearInterval(id)},[thinking,thinkingStarted]);
 useEffect(()=>{if(game.position.turn!=='b'||d.depth<=0)return;const snapshot=game;const request=++requestRef.current;setThinking(true);setThinkingStarted(Date.now());setThinkingElapsed(0);const timer=window.setTimeout(()=>{const m=chooseMove(snapshot.position,d.depth);if(request!==requestRef.current)return;if(!m){setThinking(false);return}setGame(current=>{if(current!==snapshot||request!==requestRef.current)return current;const next=snapshot.clone();const san=next.play(m);playSound(next.status().includes('draw')||next.status()==='checkmate'?'game-over':snapshot.position.board[m.to]||m.isEnPassant?'capture':next.status()==='check'?'check':'move');haptic(8);setLast(san);setThinking(false);return next;});},80);return()=>{window.clearTimeout(timer);requestRef.current++;setThinking(false)}},[game,d]);

 const commitMove=(m:Move)=>{try{const captured=Boolean(game.position.board[m.to])||Boolean(m.isEnPassant);const next=game.clone();const san=next.play(m);playSound(next.status()==='checkmate'?'game-over':next.status()==='check'?'check':captured?'capture':'move');haptic(8);setLast(san);setSelected(null);setPromotion(null);setGame(next)}catch{setSelected(null);setPromotion(null)}};
 const moveFromTo=(from:Square,to:Square)=>{const opts=legalMovesFrom(game.position,from).filter(m=>m.to===to);if(!opts.length)return;if(opts.length>1){setPromotion({moves:opts});return;}commitMove(opts[0]);};
 const click=(s:Square)=>{
  const pc=game.position.board[s];
  if(selected!==null){
   const opts=legalMovesFrom(game.position,selected).filter(m=>m.to===s);
   if(opts.length){if(opts.length>1){setPromotion({moves:opts});return}commitMove(opts[0]);return}
  }
  if(pc?.color===game.position.turn)setSelected(s);
 };
 const undo=()=>{requestRef.current++;setThinking(false);const next=game.clone();if(next.undo())setGame(next);setSelected(null)};
 const redo=()=>{const next=game.clone();if(next.redo())setGame(next);setSelected(null)};
 const fresh=()=>{requestRef.current++;setThinking(false);setGame(new ChessGame());setSelected(null);setLast('')};

 const lastMove=game.history.length?game.history[game.history.length-1].move:undefined;
 const checkSquare=game.status()==='check'||game.status()==='checkmate'?game.position.board.findIndex(p=>p?.type==='k'&&p.color===game.position.turn):null;
 const highlights=new Set(selected===null?[]:legalMovesFrom(game.position,selected).map(m=>m.to));
 const board=<ChessBoard position={game.position} selected={selected} highlights={highlights} onSquareClick={click} onSquareDrag={moveFromTo} orientation={orientation} lastMove={lastMove} checkSquare={checkSquare} renderPiece={s=>{const pc=game.position.board[s];return pc?<Piece piece={pc}/>:null;}}/>;
 const playerPanels=<div className="player-panels"><div className={`player-card ${game.position.turn==='w'?'active':''}`}><b>White</b><span>{game.position.turn==='w'?'Your turn':'Waiting'}</span></div><div className={`player-card ${game.position.turn==='b'?'active':''}`}><b>Black · AI</b><span>{game.position.turn==='b'?'Thinking':'Waiting'}</span></div></div>;
 const status=game.status(); const panel=<><div className={"thinking"} role="status" aria-live="polite">{thinking?`AI is thinking · ${(thinkingElapsed/1000).toFixed(1)}s`:"AI idle"}</div><div className={`status status-${status}`} role="status">وضعیت: <b>{status==='playing'?t('playing'):status==='check'?t('check'):status==='checkmate'?t('checkmate'):status==='stalemate'?t('stalemate'):t('draw')}</b></div><div className="meta">سطح: {d.label}<br/>Depth: {d.depth} • Elo: {d.elo}</div><h2>حرکت‌ها</h2><ol className="move-list">{game.history.map((h,i)=><li key={i} className={i===game.history.length-1?"current-move":""}><span>{Math.floor(i/2)+1}{i%2===0?".":"..."}</span><b>{h.san}</b></li>)}</ol><div className="controls"><button onClick={undo} disabled={!game.history.length}>{t('undo')}</button><button onClick={redo} disabled={!game.future.length}>{t('redo')}</button><button onClick={fresh}>{t('newGame')}</button></div><div className="last">آخرین حرکت: {last||'—'}</div><div className="pgn">{game.pgn()}</div></>;

 return <AppShell sidebar={<><div className="theme-controls"><select value={themeMode} onChange={e=>{const v=e.target.value as ThemeMode;setThemeMode(v);saveSettings({theme:v})}} aria-label="Application theme"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select><button className="theme-toggle" type="button" onClick={()=>{const next=theme.light===DEFAULT_BOARD_THEME.light?{light:'#d8e8c8',dark:'#6b8f71',piece:'#111827'}:DEFAULT_BOARD_THEME;setTheme(next);saveBoardTheme(next)}}>Board Theme</button></div><select value={level} onChange={e=>setLevel(e.target.value as DifficultyId)} aria-label="AI difficulty">{DIFFICULTIES.map(x=><option key={x.id} value={x.id}>{x.label} — Elo ~{x.elo}</option>)}</select>}>
  <style>{".chess-board{--board-light:"+theme.light+";--board-dark:"+theme.dark+"}.piece{color:"+theme.piece+"}"}</style>
  {level==='custom'&&<div className="custom-depth"><label>Depth <input type="number" min="1" max="20" value={customDepth} onChange={e=>setCustomDepth(Number(e.target.value))}/></label></div>}
  <div className="view-controls"><button className="view-toggle" type="button" onClick={()=>setOrientation(x=>x==="white"?"black":"white")}>↔ {t('flip')}</button><button type="button" onClick={()=>setSelected(null)}>Clear selection</button></div><div className={`runtime-banner ${online?'online':'offline'}`} role="status">{online?'Online':'Offline — بازی محلی ادامه دارد'}</div>
  <GameLayout board={<>{playerPanels}{board}</>} panel={panel}/>{game.status()!=='playing'&&game.status()!=='check'&&<div className="game-over" role="dialog"><strong>Game Over</strong><span>{game.status()}</span><button type="button" onClick={fresh}>Rematch</button></div>}
 {promotion&&<div className="promotion-backdrop" role="dialog" aria-modal="true" aria-label="Choose promotion"><div className="promotion-dialog"><h2>Choose promotion</h2>{(['q','r','b','n'] as Promotion[]).map(type=>{const move=promotion.moves.find(m=>m.promotion===type);return <button key={type} type="button" className="promotion-choice" onClick={()=>move&&commitMove(move)}><Piece piece={{color:game.position.turn,type}}/></button>})}</div></div>}
 </AppShell>;
}
