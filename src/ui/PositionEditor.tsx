import {useMemo,useState} from 'react';
import type {Position,PieceType,Color} from '../core/types';
import {parseSquare,squareName} from '../core/board';
import Piece from './Piece';
import {EDITOR_PIECES,editorFEN,editorFromPosition,editorInitial,editorToPosition,setEditorPiece,validateEditorState,type EditorState} from '../app/positionEditor';

type Props={initial?:Position;onApply:(position:Position)=>void;onClose:()=>void};

export default function PositionEditor({initial,onApply,onClose}:Props){
 const [state,setState]=useState<EditorState>(()=>initial?editorFromPosition(initial):editorInitial());
 const [color,setColor]=useState<Color>('w');
 const [pieceType,setPieceType]=useState<PieceType>('q');
 const [epText,setEpText]=useState(()=>state.ep===null?'':squareName(state.ep));
 const error=useMemo(()=>{if(epText){if(!/^[a-h][1-8]$/.test(epText))return 'En-passant square must be like e3';const s=parseSquare(epText);if(s<0)return 'Invalid en-passant square';}const next={...state,ep:epText?parseSquare(epText):null};return validateEditorState(next)},[state,epText]);
 const setSquare=(square:number)=>setState(s=>setEditorPiece(s,square,{color,type:pieceType}));
 const clearSquare=(square:number)=>setState(s=>setEditorPiece(s,square,null));
 const apply=()=>{if(error)return;onApply(editorToPosition({...state,ep:epText?parseSquare(epText):null}));onClose()};
 const reset=()=>{const next=editorInitial();setState(next);setEpText('')};
 return <div className="editor-backdrop" role="dialog" aria-modal="true" aria-label="Position editor">
  <div className="position-editor">
   <div className="editor-header"><h2>Position Editor</h2><button type="button" onClick={onClose}>×</button></div>
   <div className="editor-grid">
    <div className="editor-board">{Array.from({length:64},(_,i)=>{const square=63-i;const pc=state.board[square];return <button type="button" key={square} className="editor-square" onClick={()=>pc?clearSquare(square):setSquare(square)} aria-label={squareName(square)+' '+(pc?'occupied':'empty')}>{pc?<Piece piece={pc}/>:null}</button>})}</div>
    <div className="editor-tools">
     <div className="editor-section"><b>Piece</b><div className="editor-pieces">{EDITOR_PIECES.map(type=><button type="button" key={type} className={pieceType===type?'active':''} onClick={()=>setPieceType(type)}><Piece piece={{color,type}}/></button>)}</div><div className="editor-color"><button type="button" className={color==='w'?'active':''} onClick={()=>setColor('w')}>White</button><button type="button" className={color==='b'?'active':''} onClick={()=>setColor('b')}>Black</button></div></div>
     <label>Turn<select value={state.turn} onChange={e=>setState(s=>({...s,turn:e.target.value as Color}))}><option value="w">White</option><option value="b">Black</option></select></label>
     <label>En-passant<input value={epText} onChange={e=>setEpText(e.target.value.trim().toLowerCase())} placeholder="e3"/></label>
     <div className="editor-section"><b>Castling</b>{(['wK','wQ','bK','bQ'] as const).map(key=><label className="check-row" key={key}><input type="checkbox" checked={state.castling[key]} onChange={e=>setState(s=>({...s,castling:{...s.castling,[key]:e.target.checked}}))}/>{key}</label>)}</div>
     <label>FEN<textarea readOnly value={editorFEN({...state,ep:epText?parseSquare(epText):null})}/></label>
     {error&&<div className="editor-error" role="alert">{error}</div>}
     <div className="editor-actions"><button type="button" onClick={reset}>Reset</button><button type="button" disabled={Boolean(error)} onClick={apply}>Apply Position</button></div>
    </div>
   </div>
  </div>
 </div>;
}
