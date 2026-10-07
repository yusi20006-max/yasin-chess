import {useEffect,useMemo,useRef,useState} from 'react';
import {ChessGame} from '../core/game';
import {legalMovesFrom} from '../core/moves';
import {difficulty,DIFFICULTIES,type DifficultyId} from '../engine/difficulty';
import {requestAiTurn} from '../app/aiController';
import {traceAiTurn} from '../app/aiDiagnostics';
import {loadSettings,saveSettings} from '../storage/settings';
import {loadBoardTheme,saveBoardTheme} from '../storage/boardTheme';
import type {Move,Promotion,Square} from '../core/types';
import ChessBoard from './ChessBoard';
import Piece from './Piece';
import AppShell from './AppShell';
import GameLayout from './GameLayout';
import BoardThemeSelector from './BoardThemeSelector';
import PositionEditor from './PositionEditor';
import PGNImport from './PGNImport';
import GameOverResult from './GameOverResult';
import FenLoader from './FenLoader';
import {playSound} from '../platform/sound';
import {haptic} from '../platform/haptics';
import {toFEN} from '../core/fen';
import {validateFEN,parseValidatedFEN} from '../core/fenValidate';
import {TIME_CONTROL_PRESETS,type TimeControlPreset} from '../core/timeControl';
import {translate as t,applyLocale,type Locale} from '../app/i18n';
import type {GameMode} from '../core/gameModes';
import {isHumanTurn,undoTurnPair,redoTurnPair} from '../core/gameModes';

export default function App(){
 const [game,setGame]=useState(()=>new ChessGame());
 const [selected,setSelected]=useState<Square|null>(null);
 const [promotion,setPromotion]=useState<{from:Square;to:Square;moves:Move[]}|null>(null);
 const [level,setLevel]=useState<DifficultyId>('club');
 const [hydrated,setHydrated]=useState(false);
 const [thinking,setThinking]=useState(false);
 const [thinkingStarted,setThinkingStarted]=useState(0);
 const [thinkingElapsed,setThinkingElapsed]=useState(0);
 const [orientation,setOrientation]=useState<'w'|'b'>('w');
 const [locale,setLocale]=useState<Locale>('fa');
 const [theme,setTheme]=useState(()=>loadBoardTheme());
 const [gameMode,setGameMode]=useState<GameMode>('human-vs-ai');
 const [showPositionEditor,setShowPositionEditor]=useState(false);
 const [showPGNImport,setShowPGNImport]=useState(false);
 const [showFenLoader,setShowFenLoader]=useState(false);
 const [fenInput,setFenInput]=useState('');
 const [fenError,setFenError]=useState('');
 const [timeControl,setTimeControl]=useState<TimeControlPreset>(TIME_CONTROL_PRESETS[2]);
 const [clockMs,setClockMs]=useState({w:600000,b:600000});
 const requestRef=useRef(0);
 const clockTurn=useRef<'w'|'b'>('w');
 const clockLast=useRef(Date.now());
 const d=useMemo(()=>difficulty(level),[level]);
 const status=game.status();
 useEffect(()=>{const s=loadSettings();if(s.difficulty)setLevel(s.difficulty);if(s.language){setLocale(s.language as Locale);applyLocale(s.language as Locale)}if(s.timeControl)setTimeControl(s.timeControl);setHydrated(true)},[]);
 useEffect(()=>{if(hydrated)saveSettings({difficulty:level,language:locale,timeControl})},[level,locale,timeControl,hydrated]);
 useEffect(()=>{if(!thinking||!thinkingStarted)return;const id=window.setInterval(()=>setThinkingElapsed(Date.now()-thinkingStarted),100);return()=>window.clearInterval(id)},[thinking,thinkingStarted]);
 useEffect(()=>{const previous=clockTurn.current;if(previous!==game.position.turn){setClockMs(v=>({...v,[previous]:v[previous]+timeControl.incrementSeconds*1000}));clockTurn.current=game.position.turn;clockLast.current=Date.now()}const id=window.setInterval(()=>{if(status!=='playing'&&status!=='check')return;const now=Date.now();const delta=Math.max(0,now-clockLast.current);clockLast.current=now;setClockMs(v=>({...v,[game.position.turn]:Math.max(0,v[game.position.turn]-delta)}))},250);return()=>window.clearInterval(id)},[game.position.turn,status,timeControl.incrementSeconds]);
 useEffect(()=>{traceAiTurn('effect-enter',{turn:game.position.turn});if((gameMode!=='ai-vs-ai'&&game.position.turn!=='b')||d.depth<=0){traceAiTurn('effect-skip',{turn:game.position.turn});return}const snapshot=game;const request=++requestRef.current;const controller=new AbortController();traceAiTurn('effect-request',{request,turn:snapshot.position.turn});setThinking(true);setThinkingStarted(Date.now());setThinkingElapsed(0);const timer=window.setTimeout(()=>{traceAiTurn('timer-fired',{request,turn:snapshot.position.turn});Promise.resolve().then(()=>{traceAiTurn('choose-start',{request});return requestAiTurn({position:snapshot.position,depth:d.depth,signal:controller.signal})}).then(m=>{traceAiTurn('choose-return',{request,move:m});if(request!==requestRef.current){traceAiTurn('request-guard-fail',{request});return}traceAiTurn('request-guard-pass',{request});if(!m){setThinking(false);return}setGame(current=>{if(current!==snapshot||request!==requestRef.current){traceAiTurn('game-guard-fail',{request,sameGame:current===snapshot});return current}traceAiTurn('game-guard-pass',{request,sameGame:true});const next=snapshot.clone();next.play(m);playSound(next.status().includes('draw')||next.status()==='checkmate'?'game-over':snapshot.position.board[m.to]||m.isEnPassant?'capture':next.status()==='check'?'check':'move');haptic(8);setThinking(false);traceAiTurn('move-applied',{request,move:m});return next})}).catch(error=>{traceAiTurn('choose-error',{request,error:String(error)});if(request===requestRef.current)setThinking(false)})},0);return()=>{window.clearTimeout(timer);traceAiTurn('effect-cleanup',{request});requestRef.current++;setThinking(false)}},[game,d]);
 const commitMove=(m:Move)=>{try{const captured=Boolean(game.position.board[m.to])||Boolean(m.isEnPassant);const next=game.clone();next.play(m);playSound(next.status()==='checkmate'?'game-over':next.status()==='check'?'check':captured?'capture':'move');haptic(8);setSelected(null);setPromotion(null);setGame(next)}catch{setSelected(null);setPromotion(null)}};
 const moveFromTo=(from:Square,to:Square)=>{if(!hydrated||thinking||!isHumanTurn(gameMode,game.position.turn))return;const piece=game.position.board[from];if(piece?.color!==game.position.turn)return;const moves=legalMovesFrom(game.position,from).filter(m=>m.to===to);if(!moves.length)return;if(moves.some(m=>m.promotion)){setPromotion({from,to,moves});return}commitMove(moves[0])};
 const click=(s:Square)=>{if(!hydrated||thinking||!isHumanTurn(gameMode,game.position.turn))return;const pc=game.position.board[s];if(selected!==null){const opts=legalMovesFrom(game.position,selected).filter(m=>m.to===s);if(opts.length){if(opts.some(m=>m.promotion)){setPromotion({from:selected,to:s,moves:opts});return}commitMove(opts[0]);return}if(pc?.color===game.position.turn){setSelected(s);return}setSelected(null);return}if(pc?.color===game.position.turn)setSelected(s)};
 const forceMove=()=>{const controller=new AbortController();traceAiTurn('force-enter',{turn:game.position.turn});if(!hydrated||game.position.turn!=='b'||status!=='playing'||thinking){traceAiTurn('force-guard-fail',{turn:game.position.turn});return}requestRef.current++;setThinking(false);const snapshot=game;const request=++requestRef.current;traceAiTurn('effect-request',{request,turn:snapshot.position.turn});setThinking(true);setThinkingStarted(Date.now());setThinkingElapsed(0);Promise.resolve().then(()=>{traceAiTurn('choose-start',{request});return requestAiTurn({position:snapshot.position,depth:d.depth,signal:controller.signal})}).then(m=>{traceAiTurn('choose-return',{request,move:m});if(request!==requestRef.current){traceAiTurn('request-guard-fail',{request});return}traceAiTurn('request-guard-pass',{request});if(!m){setThinking(false);return}setGame(current=>{if(current!==snapshot||request!==requestRef.current){traceAiTurn('game-guard-fail',{request,sameGame:current===snapshot});return current}traceAiTurn('game-guard-pass',{request,sameGame:true});const next=snapshot.clone();next.play(m);setThinking(false);traceAiTurn('move-applied',{request,move:m});return next})}).catch(error=>{traceAiTurn('choose-error',{request,error:String(error)});if(request===requestRef.current)setThinking(false)});
 const undo=()=>{requestRef.current++;setThinking(false);const next=game.clone();if(undoTurnPair(next,gameMode))setGame(next);setSelected(null)};
 const redo=()=>{requestRef.current++;setThinking(false);const next=game.clone();if(redoTurnPair(next,gameMode))setGame(next);setSelected(null)};
 const fresh=()=>{requestRef.current++;setThinking(false);const baseMs=timeControl.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current='w';clockLast.current=Date.now();setGame(new ChessGame());setSelected(null)};
 const setAppLocale=(next:Locale)=>{setLocale(next);applyLocale(next)};
 const applyImportedGame=(imported:ChessGame)=>{requestRef.current++;setThinking(false);setGame(imported);setSelected(null);setPromotion(null);const baseMs=timeControl.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current=imported.position.turn;clockLast.current=Date.now()};
 const loadFEN=()=>{const result=validateFEN(fenInput);if(!result.valid){setFenError(result.error);return}try{applyEditedPosition(parseValidatedFEN(fenInput))}catch(error){setFenError(error instanceof Error?error.message:'Invalid FEN');return}setFenError('');setShowFenLoader(false)};
 const applyEditedPosition=(position:Parameters<typeof toFEN>[0])=>{requestRef.current++;setThinking(false);const next=new ChessGame(toFEN(position));setGame(next);setSelected(null);setPromotion(null);const baseMs=timeControl.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current=next.position.turn;clockLast.current=Date.now()};
 const applyLoadedPosition=(position:Parameters<typeof toFEN>[0])=>{requestRef.current++;setThinking(false);const next=new ChessGame(toFEN(position));setGame(next);setSelected(null);setPromotion(null);const baseMs=timeControl.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current=next.position.turn;clockLast.current=Date.now()};
 const changeTimeControl=(id:string)=>{const next=TIME_CONTROL_PRESETS.find(x=>x.id===id)??TIME_CONTROL_PRESETS[2];setTimeControl(next);saveSettings({timeControl:next});const baseMs=next.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current=game.position.turn;clockLast.current=Date.now()};
 const lastMove=game.history.length?game.history[game.history.length-1].move:undefined;
 const checkSquare=status==='check'||status==='checkmate'?game.position.board.findIndex(p=>p?.type==='k'&&p.color===game.position.turn):null;
 const highlights=new Set(selected===null?[]:legalMovesFrom(game.position,selected).map(m=>m.to));
 const board=<ChessBoard position={game.position} selected={selected} highlights={highlights} onSquareClick={click} onSquareDrag={moveFromTo} onEscape={()=>{setSelected(null);setPromotion(null)}} orientation={orientation} lastMove={lastMove} checkSquare={checkSquare} renderPiece={s=>{const pc=game.position.board[s];return pc?<Piece piece={pc}/>:null}}/>;
 const reviewMoves=()=>document.querySelector('.move-list')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
 const formatClock=(ms:number)=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
 const whiteIdentity=gameMode==='ai-vs-ai'?`AI · Elo ${d.elo}`:gameMode==='human-vs-human'?'Human':`Human · Elo ${d.elo}`;
 const blackIdentity=gameMode==='ai-vs-ai'?`AI · Elo ${d.elo}`:'AI · Elo '+d.elo;
 const playerPanels=<div className="player-panels" data-component="player-panels" role="group" aria-label="Players"><div className={`player-card ${game.position.turn==='w'?'active':''}`}><div><span>White</span><strong>{whiteIdentity}</strong></div><strong className="player-clock" aria-label={`White ${formatClock(clockMs.w)}`}>{formatClock(clockMs.w)}</strong></div><div className={`player-card ${game.position.turn==='b'?'active':''}`}><div><span>Black</span><strong>{blackIdentity}</strong></div><strong className="player-clock" aria-label={`Black ${formatClock(clockMs.b)}`}>{formatClock(clockMs.b)}</strong></div></div>;
 const panel=<><div className={`thinking ${thinking?'thinking-active':''}`} data-ai-thinking={thinking?"true":"false"} role="status" aria-live="polite" aria-atomic="true">{thinking?`${t('thinking')} · ${(thinkingElapsed/1000).toFixed(1)}s`:t('idle')}</div><div className={`status status-${status}`} role="status">وضعیت: <b>{status==='playing'?t('playing'):status==='check'?t('check'):status==='checkmate'?t('checkmate'):status==='stalemate'?t('stalemate'):t('draw')}</b></div><div className="meta">سطح: {d.label}<br/>Depth: {d.depth} • Elo: {d.elo}</div><section className="moves-panel" aria-label={t('moves')}><div className="moves-panel-header"><h2>{t('moves')}</h2><span>{game.history.length} ply</span></div><ol className="move-list">{Array.from({length:Math.ceil(game.history.length/2)},(_,row)=>{const white=game.history[row*2],black=game.history[row*2+1];return <li key={row} className={white?.move===lastMove||black?.move===lastMove?'current-move':''}><span className="move-number">{String(row+1).padStart(2,'0')}.</span><b className={white?.move===lastMove?'move-current':''}>{white?.san??'—'}</b><b className={black?.move===lastMove?'move-current':''}>{black?.san??'—'}</b></li>})}</ol></section><div className="controls"><button onClick={undo} disabled={!game.history.length}>{t('undo')}</button><button onClick={forceMove} disabled={!hydrated||thinking||gameMode!=='human-vs-ai'||game.position.turn!=='b'||status!=='playing'}>{t('force')}</button><button onClick={redo} disabled={!game.future.length}>{t('redo')}</button><button onClick={fresh}>{t('newGame')}</button></div><div className="pgn">{game.pgn()}</div></>;
 return <AppShell sidebar={<><div className="menu-section" data-section="game-settings">
    <h2>{locale==='fa'?'بازی':'Game'}</h2>
    <label className="menu-field"><span>{locale==='fa'?'حالت بازی':'Game mode'}</span><select value={gameMode} onChange={e=>{requestRef.current++;setThinking(false);setGameMode(e.target.value as GameMode);setSelected(null)}} aria-label="Game mode"><option value="human-vs-ai">Human vs AI</option><option value="human-vs-human">Human vs Human</option><option value="ai-vs-ai">AI vs AI</option></select></label>
    <label className="menu-field"><span>{t('difficulty')}</span><select value={level} onChange={e=>setLevel(e.target.value as DifficultyId)} aria-label={t('difficulty')}>{DIFFICULTIES.map(x=><option key={x.id} value={x.id}>{x.label} — Elo ~{x.elo}</option>)}</select></label>
    <label className="menu-field"><span>{locale==='fa'?'کنترل زمان':'Time control'}</span><select value={timeControl.id} onChange={e=>changeTimeControl(e.target.value)} aria-label="Time control">{TIME_CONTROL_PRESETS.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></label>
  </div>
  <div className="menu-section" data-section="board-view">
    <h2>{locale==='fa'?'صفحه':'Board'}</h2>
    <button type="button" onClick={()=>setOrientation(o=>o==='w'?'b':'w')}>{t('flip')}</button>
    <button type="button" onClick={()=>setShowPositionEditor(true)}>{locale==='fa'?'ویرایش وضعیت':'Position editor'}</button>
    <button type="button" onClick={()=>setShowPGNImport(true)}>{locale==='fa'?'وارد کردن PGN':'Import PGN'}</button>
    <button type="button" onClick={()=>{setFenInput(toFEN(game.position));setFenError('');setShowFenLoader(true)}}>{locale==='fa'?'بارگذاری FEN':'Load FEN'}</button>
  </div></>} settings={<><div className="menu-section">
      <h2>{t('theme')}</h2>
      <select value={locale} onChange={e=>setAppLocale(e.target.value as Locale)} aria-label={t('language')}><option value="fa">{t('languageFa')}</option><option value="en">{t('languageEn')}</option></select>
      <div className="board-theme-field"><span className="theme-field-label">{t('boardTheme')}</span><BoardThemeSelector value={theme} onChange={next=>{setTheme(next);saveBoardTheme(next)}}/></div>
    </div></>}>
  <style>{`.chess-board{--board-light:${theme.light};--board-dark:${theme.dark}}.piece{color:${theme.piece}}`}</style>
  <div className="runtime-banner offline" role="status">{t('offline')}</div>
  <GameLayout board={<>{playerPanels}{board}</>} panel={panel}/>
  {status!=='playing'&&status!=='check'&&<><span className="sr-only">{t('gameOver')}</span><GameOverResult status={status} turn={game.position.turn} gameMode={gameMode} onNewGame={fresh} onReview={reviewMoves}/></>} 
  {showPositionEditor&&<PositionEditor initial={game.position} onApply={applyEditedPosition} onClose={()=>setShowPositionEditor(false)}/>}
  {showPGNImport&&<PGNImport onApply={applyImportedGame} onClose={()=>setShowPGNImport(false)}/>}
  {showFenLoader&&<div className="editor-backdrop" role="dialog" aria-modal="true" aria-label="Load FEN"><div className="position-editor fen-loader"><div className="editor-header"><h2>Load FEN</h2><button type="button" onClick={()=>setShowFenLoader(false)}>×</button></div><label>FEN<textarea value={fenInput} onChange={e=>{setFenInput(e.target.value);setFenError('')}} placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"/></label>{fenError&&<div className="editor-error" role="alert">{fenError}</div>}<div className="editor-actions"><button type="button" onClick={()=>setFenInput(toFEN(game.position))}>Current position</button><button type="button" onClick={loadFEN}>Load position</button></div></div></div>}
  {showFenLoader&&<FenLoader initial={toFEN(game.position)} onLoad={applyLoadedPosition} onClose={()=>setShowFenLoader(false)}/>}
  {promotion&&<div className="promotion-backdrop" role="dialog" aria-modal="true" aria-label={t('choosePromotion')}><div className="promotion-dialog"><h2>{t('choosePromotion')}</h2>{(['q','r','b','n'] as Promotion[]).map(type=>{const move=promotion.moves.find(m=>m.promotion===type);return <button key={type} type="button" className="promotion-choice" onClick={()=>move&&commitMove(move)}><Piece piece={{color:game.position.turn,type}}/></button>})}</div></div>}
 </AppShell>;
}
