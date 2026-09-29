import {useEffect,useMemo,useRef,useState} from 'react';
import {ChessGame} from '../core/game';
import {legalMovesFrom} from '../core/moves';
import {difficulty,DIFFICULTIES,type DifficultyId} from '../engine/difficulty';
import {requestAiTurn} from '../app/aiController';
import type {Promotion,Square,Move} from '../core/types';
import AppShell from './AppShell';
import GameLayout from './GameLayout';
import ChessBoard from './ChessBoard';
import Piece from './Piece';
import './styles.css';
import './theme.css';
import {loadSettings,saveSettings,TIME_CONTROL_PRESETS,type ThemeMode,type TimeControl} from '../app/settings';
import {applyLocale,translate,type Locale} from '../app/i18n';
import {playSound} from './sound';
import {haptic} from './haptics';
import './portrait.css';
import './landscape.css';
import './safeArea.css';
import {resumeActiveGame} from '../storage/activeGame';
import {isHumanTurn,type GameMode} from '../app/modes';
import {recordStartup} from '../platform/startup';
import {runtimeKind} from '../platform/runtime';
import {bindLifecycle} from '../platform/lifecycle';
import {bindBackNavigation} from '../platform/backNavigation';
import {enableEdgeToEdge} from '../platform/edgeToEdge';
import {markSafeAreaSupport} from '../platform/safeArea';
import {allowResponsiveOrientation} from '../platform/orientation';
import {syncSystemUi} from '../platform/systemUi';
import {DEFAULT_BOARD_THEME,loadBoardTheme,saveBoardTheme} from './boardSettings';
import {traceAiTurn} from '../app/aiTurnDiagnostic';
import {undoTurnPair,redoTurnPair} from '../app/undoTurn';
import {toFEN} from '../core/board';
import {parseValidatedFEN,validateFEN} from '../app/importExport';
import PositionEditor from './PositionEditor';
import FenLoader from './FenLoader';

export default function App(){
 recordStartup(runtimeKind());
 markSafeAreaSupport();
 allowResponsiveOrientation().catch(()=>{});
 useEffect(()=>{enableEdgeToEdge().catch(()=>{})},[]);
 useEffect(()=>{let dispose=()=>{};bindLifecycle().then(fn=>{dispose=fn}).catch(()=>{});bindBackNavigation(()=>window.dispatchEvent(new Event('yasin:back'))).then(fn=>{const old=dispose;dispose=()=>{fn();old()}}).catch(()=>{});return()=>dispose()},[]);
 const [game,setGame]=useState(()=>new ChessGame());
 const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{let alive=true;resumeActiveGame().then(saved=>{if(!alive)return;if(saved)setGame(saved);setHydrated(true)}).catch(()=>{if(alive)setHydrated(true)});return()=>{alive=false}},[]);
 const [selected,setSelected]=useState<Square|null>(null);
 const [level,setLevel]=useState<DifficultyId>('beginner');
 const [gameMode,setGameMode]=useState<GameMode>('human-vs-ai');
 const [customDepth,setCustomDepth]=useState(8);
 const [last,setLast]=useState('');
 const [promotion,setPromotion]=useState<{moves:Move[]}|null>(null);
 const [theme,setTheme]=useState(()=>loadBoardTheme());
 const [themeMode,setThemeMode]=useState<ThemeMode>(()=>loadSettings().theme);
 const [locale,setAppLocale]=useState<Locale>(()=>loadSettings().language);
 const t=(key:Parameters<typeof translate>[1])=>translate(locale,key);
 const [orientation,setOrientation]=useState<'white'|'black'>('white');
 const [thinking,setThinking]=useState(false);
 const [thinkingStarted,setThinkingStarted]=useState(0);
 const [thinkingElapsed,setThinkingElapsed]=useState(0);
 const [showPositionEditor,setShowPositionEditor]=useState(false);
 const [showFenLoader,setShowFenLoader]=useState(false);
 const [timeControl,setTimeControl]=useState<TimeControl>(()=>loadSettings().timeControl);
 const [clockMs,setClockMs]=useState({w:loadSettings().timeControl.minutes*60000,b:loadSettings().timeControl.minutes*60000});
 const clockLast=useRef(Date.now());
 const clockTurn=useRef(game.position.turn);
 const status=game.status();
 useEffect(()=>{applyLocale(locale);saveSettings({language:locale})},[locale]);
 const requestRef=useRef(0);
 useEffect(()=>{const onBack=()=>{setSelected(null);setPromotion(null)};window.addEventListener('yasin:back',onBack);return()=>window.removeEventListener('yasin:back',onBack)},[]);

 useEffect(()=>{const previous=clockTurn.current;if(previous!==game.position.turn){setClockMs(v=>({...v,[previous]:v[previous]+timeControl.incrementSeconds*1000}));clockTurn.current=game.position.turn;clockLast.current=Date.now()}const id=window.setInterval(()=>{if(status!=='playing'&&status!=='check')return;const now=Date.now();const delta=Math.max(0,now-clockLast.current);clockLast.current=now;setClockMs(v=>({...v,[game.position.turn]:Math.max(0,v[game.position.turn]-delta)}))},250);return()=>window.clearInterval(id)},[game.position.turn,status,timeControl.incrementSeconds]);
 useEffect(()=>{const root=document.documentElement;const apply=()=>{const mode=themeMode==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):themeMode;root.dataset.theme=mode;syncSystemUi(mode).catch(()=>{})};apply();if(themeMode!=='system')return;const mq=window.matchMedia('(prefers-color-scheme: dark)');mq.addEventListener('change',apply);return()=>mq.removeEventListener('change',apply)},[themeMode]);
 const d=useMemo(()=>difficulty(level,level==='custom'?{depth:customDepth}:{}),[level,customDepth]);
 useEffect(()=>{if(!thinking)return;const id=window.setInterval(()=>setThinkingElapsed(Math.max(0,Date.now()-thinkingStarted)),250);return()=>window.clearInterval(id)},[thinking,thinkingStarted]);
 useEffect(()=>{traceAiTurn('effect-enter',{turn:game.position.turn});if((gameMode!=='ai-vs-ai'&&game.position.turn!=='b')||d.depth<=0){traceAiTurn('effect-skip',{turn:game.position.turn});return}const snapshot=game;const request=++requestRef.current;const controller=new AbortController();traceAiTurn('effect-request',{request,turn:snapshot.position.turn});setThinking(true);setThinkingStarted(Date.now());setThinkingElapsed(0);const timer=window.setTimeout(()=>{traceAiTurn('timer-fired',{request,turn:snapshot.position.turn});Promise.resolve().then(()=>{traceAiTurn('choose-start',{request});return requestAiTurn({position:snapshot.position,depth:d.depth,signal:controller.signal})}).then(m=>{traceAiTurn('choose-return',{request,move:m});if(request!==requestRef.current){traceAiTurn('request-guard-fail',{request});return}traceAiTurn('request-guard-pass',{request});if(!m){setThinking(false);return}setGame(current=>{if(current!==snapshot||request!==requestRef.current){traceAiTurn('game-guard-fail',{request,sameGame:current===snapshot});return current}traceAiTurn('game-guard-pass',{request,sameGame:true});const next=snapshot.clone();const san=next.play(m);playSound(next.status().includes('draw')||next.status()==='checkmate'?'game-over':snapshot.position.board[m.to]||m.isEnPassant?'capture':next.status()==='check'?'check':'move');haptic(8);setLast(san);setThinking(false);traceAiTurn('move-applied',{request,move:m});return next})}).catch(error=>{traceAiTurn('choose-error',{request,error:String(error)});if(request===requestRef.current)setThinking(false)})},0);return()=>{window.clearTimeout(timer);traceAiTurn('effect-cleanup',{request});requestRef.current++;setThinking(false)}},[game,d]);
 const commitMove=(m:Move)=>{try{const captured=Boolean(game.position.board[m.to])||Boolean(m.isEnPassant);const next=game.clone();const san=next.play(m);playSound(next.status()==='checkmate'?'game-over':next.status()==='check'?'check':captured?'capture':'move');haptic(8);setLast(san);setSelected(null);setPromotion(null);setGame(next)}catch{setSelected(null);setPromotion(null)}};
 const moveFromTo=(from:Square,to:Square)=>{if(!hydrated||thinking||!isHumanTurn(gameMode,game.position.turn))return;const piece=game.position.board[from];if(piece?.color!==game.position.turn)return;const opts=legalMovesFrom(game.position,from).filter(m=>m.to===to);if(!opts.length)return;if(opts.length>1){setPromotion({moves:opts});return}commitMove(opts[0])};
 const click=(s:Square)=>{if(!hydrated||thinking||!isHumanTurn(gameMode,game.position.turn))return;const pc=game.position.board[s];if(selected!==null){const opts=legalMovesFrom(game.position,selected).filter(m=>m.to===s);if(opts.length){if(opts.length>1){setPromotion({moves:opts});return}commitMove(opts[0]);return}}if(pc?.color===game.position.turn)setSelected(s)};
 const forceMove=()=>{const controller=new AbortController();traceAiTurn('force-enter',{turn:game.position.turn});if(!hydrated||game.position.turn!=='b'||status!=='playing'||thinking){traceAiTurn('force-guard-fail',{turn:game.position.turn});return}requestRef.current++;setThinking(false);const snapshot=game;const request=++requestRef.current;traceAiTurn('effect-request',{request,turn:snapshot.position.turn});setThinking(true);setThinkingStarted(Date.now());setThinkingElapsed(0);Promise.resolve().then(()=>{traceAiTurn('choose-start',{request});return requestAiTurn({position:snapshot.position,depth:d.depth,signal:controller.signal})}).then(m=>{traceAiTurn('choose-return',{request,move:m});if(request!==requestRef.current){traceAiTurn('request-guard-fail',{request});return}traceAiTurn('request-guard-pass',{request});if(!m){setThinking(false);return}setGame(current=>{if(current!==snapshot||request!==requestRef.current){traceAiTurn('game-guard-fail',{request,sameGame:current===snapshot});return current}traceAiTurn('game-guard-pass',{request,sameGame:true});const next=snapshot.clone();const san=next.play(m);setLast(san);setThinking(false);traceAiTurn('move-applied',{request,move:m});return next})}).catch(error=>{traceAiTurn('choose-error',{request,error:String(error)});if(request===requestRef.current)setThinking(false)})};
 const undo=()=>{requestRef.current++;setThinking(false);const next=game.clone();if(undoTurnPair(next,gameMode))setGame(next);setSelected(null)};
 const redo=()=>{requestRef.current++;setThinking(false);const next=game.clone();if(redoTurnPair(next,gameMode))setGame(next);setSelected(null)};
 const fresh=()=>{requestRef.current++;setThinking(false);const baseMs=timeControl.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current='w';clockLast.current=Date.now();setGame(new ChessGame());setSelected(null);setLast('')};
 const loadFEN=()=>{const result=validateFEN(fenInput);if(!result.valid){setFenError(result.error);return}try{applyEditedPosition(parseValidatedFEN(fenInput))}catch(error){setFenError(error instanceof Error?error.message:'Invalid FEN');return}setFenError('');setShowFenLoader(false)};
 const applyEditedPosition=(position:Parameters<typeof toFEN>[0])=>{requestRef.current++;setThinking(false);const next=new ChessGame(toFEN(position));setGame(next);setSelected(null);setPromotion(null);setLast('');const baseMs=timeControl.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current=next.position.turn;clockLast.current=Date.now()};
 const applyLoadedPosition=(position:Parameters<typeof toFEN>[0])=>{requestRef.current++;setThinking(false);const next=new ChessGame(toFEN(position));setGame(next);setSelected(null);setPromotion(null);setLast('');const baseMs=timeControl.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current=next.position.turn;clockLast.current=Date.now()};
 const changeTimeControl=(id:string)=>{const next=TIME_CONTROL_PRESETS.find(x=>x.id===id)??TIME_CONTROL_PRESETS[2];setTimeControl(next);saveSettings({timeControl:next});const baseMs=next.minutes*60000;setClockMs({w:baseMs,b:baseMs});clockTurn.current=game.position.turn;clockLast.current=Date.now()};
 const lastMove=game.history.length?game.history[game.history.length-1].move:undefined;
 const checkSquare=status==='check'||status==='checkmate'?game.position.board.findIndex(p=>p?.type==='k'&&p.color===game.position.turn):null;
 const highlights=new Set(selected===null?[]:legalMovesFrom(game.position,selected).map(m=>m.to));
 const board=<ChessBoard position={game.position} selected={selected} highlights={highlights} onSquareClick={click} onSquareDrag={moveFromTo} onEscape={()=>{setSelected(null);setPromotion(null)}} orientation={orientation} lastMove={lastMove} checkSquare={checkSquare} renderPiece={s=>{const pc=game.position.board[s];return pc?<Piece piece={pc}/>:null}}/>;
 const formatClock=(ms:number)=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
 const playerPanels=<div className="player-panels"><div className={`player-card ${game.position.turn==='w'?'active':''}`}><b>{gameMode==='ai-vs-ai'?'AI 1':t('white')}</b><strong className="player-clock" aria-label={`White ${formatClock(clockMs.w)}`}>{formatClock(clockMs.w)}</strong><span>{game.position.turn==='w'?t('yourTurn'):t('waiting')}</span></div><div className={`player-card ${game.position.turn==='b'?'active':''}`}><b>{gameMode==='ai-vs-ai'?'AI 2':gameMode==='human-vs-human'?t('blackAi'):t('blackAi')}</b><strong className="player-clock" aria-label={`Black ${formatClock(clockMs.b)}`}>{formatClock(clockMs.b)}</strong><span>{game.position.turn==='b'?t('thinking'):t('waiting')}</span></div></div>;
 const panel=<><div className="thinking" role="status" aria-live="polite">{thinking?`${t('thinking')} · ${(thinkingElapsed/1000).toFixed(1)}s`:`${t('idle')}`}</div><div className={`status status-${status}`} role="status">وضعیت: <b>{status==='playing'?t('playing'):status==='check'?t('check'):status==='checkmate'?t('checkmate'):status==='stalemate'?t('stalemate'):t('draw')}</b></div><div className="meta">سطح: {d.label}<br/>Depth: {d.depth} • Elo: {d.elo}</div><h2>{t('moves')}</h2><ol className="move-list">{game.history.map((h,i)=><li key={i} className={i===game.history.length-1?'current-move':''}><span>{Math.floor(i/2)+1}{i%2===0?'.':'...'}</span><b>{h.san}</b></li>)}</ol><div className="controls"><button onClick={undo} disabled={!game.history.length}>{t('undo')}</button><button onClick={forceMove} disabled={!hydrated||thinking||gameMode!=='human-vs-ai'||game.position.turn!=='b'||status!=='playing'}>{t('force')}</button><button onClick={redo} disabled={!game.future.length}>{t('redo')}</button><button onClick={fresh}>{t('newGame')}</button></div><div className="last">{t('lastMove')}: {last||'—'}</div><div className="pgn">{game.pgn()}</div></>;
 return <AppShell sidebar={<><div className="theme-controls"><select value={themeMode} onChange={e=>{const v=e.target.value as ThemeMode;setThemeMode(v);saveSettings({theme:v})}} aria-label={t('theme')}><option value="system">{t('system')}</option><option value="light">{t('light')}</option><option value="dark">{t('dark')}</option></select><select value={locale} onChange={e=>setAppLocale(e.target.value as Locale)} aria-label={t('language')}><option value="fa">{t('languageFa')}</option><option value="en">{t('languageEn')}</option></select><button className="theme-toggle" type="button" onClick={()=>{const next=theme.light===DEFAULT_BOARD_THEME.light?{light:'#d8e8c8',dark:'#6b8f71',piece:'#111827'}:DEFAULT_BOARD_THEME;setTheme(next);saveBoardTheme(next)}}>{t('boardTheme')}</button></div><select value={gameMode} onChange={e=>{requestRef.current++;setThinking(false);setGameMode(e.target.value as GameMode);setSelected(null)}} aria-label="Game mode"><option value="human-vs-ai">Human vs AI</option><option value="human-vs-human">Human vs Human</option><option value="ai-vs-ai">AI vs AI</option></select><select value={level} onChange={e=>setLevel(e.target.value as DifficultyId)} aria-label={t('difficulty')}>{DIFFICULTIES.map(x=><option key={x.id} value={x.id}>{x.label} — Elo ~{x.elo}</option>)}</select><select value={timeControl.id} onChange={e=>changeTimeControl(e.target.value)} aria-label="Time control">{TIME_CONTROL_PRESETS.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></>}>
  <style>{`.chess-board{--board-light:${theme.light};--board-dark:${theme.dark}}.piece{color:${theme.piece}}`}</style>
  {level==='custom'&&<div className="custom-depth"><label>{t('depth')} <input type="number" min="1" max="20" value={customDepth} onChange={e=>setCustomDepth(Number(e.target.value))}/></label></div>}
  <div className="view-controls"><button className="view-toggle" type="button" onClick={()=>setOrientation(x=>x==='white'?'black':'white')}>↔ {t('flip')}</button><button type="button" onClick={()=>setShowPositionEditor(true)}>Position Editor</button><button type="button" onClick={()=>{setFenInput(toFEN(game.position));setFenError('');setShowFenLoader(true)}}>Load FEN</button><button type="button" onClick={()=>setShowFenLoader(true)}>Load FEN</button><button type="button" onClick={()=>setSelected(null)}>{t('clear')}</button></div>
  <div className="runtime-banner offline" role="status">{t('offline')}</div>
  <GameLayout board={<>{playerPanels}{board}</>} panel={panel}/>
  {status!=='playing'&&status!=='check'&&<div className="game-over" role="dialog"><strong>{t('gameOver')}</strong><span>{status}</span><button type="button" onClick={fresh}>{t('rematch')}</button></div>}
  {showPositionEditor&&<PositionEditor initial={game.position} onApply={applyEditedPosition} onClose={()=>setShowPositionEditor(false)}/>}
  {showFenLoader&&<div className="editor-backdrop" role="dialog" aria-modal="true" aria-label="Load FEN"><div className="position-editor fen-loader"><div className="editor-header"><h2>Load FEN</h2><button type="button" onClick={()=>setShowFenLoader(false)}>×</button></div><label>FEN<textarea value={fenInput} onChange={e=>{setFenInput(e.target.value);setFenError('')}} placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"/></label>{fenError&&<div className="editor-error" role="alert">{fenError}</div>}<div className="editor-actions"><button type="button" onClick={()=>setFenInput(toFEN(game.position))}>Current position</button><button type="button" onClick={loadFEN}>Load position</button></div></div></div>}
  {showFenLoader&&<FenLoader initial={toFEN(game.position)} onLoad={applyLoadedPosition} onClose={()=>setShowFenLoader(false)}/>}
  {promotion&&<div className="promotion-backdrop" role="dialog" aria-modal="true" aria-label={t('choosePromotion')}><div className="promotion-dialog"><h2>{t('choosePromotion')}</h2>{(['q','r','b','n'] as Promotion[]).map(type=>{const move=promotion.moves.find(m=>m.promotion===type);return <button key={type} type="button" className="promotion-choice" onClick={()=>move&&commitMove(move)}><Piece piece={{color:game.position.turn,type}}/></button>})}</div></div>}
 </AppShell>;
}
