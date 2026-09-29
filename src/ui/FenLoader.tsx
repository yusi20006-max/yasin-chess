import {useState} from 'react';
import {parseValidatedFEN,validateFEN} from '../app/importExport';
import type {Position} from '../core/types';

type Props={initial?:string;onLoad:(position:Position)=>void;onClose:()=>void};

export default function FenLoader({initial='',onLoad,onClose}:Props){
 const [value,setValue]=useState(initial);
 const result=validateFEN(value);
 const load=()=>{if(!result.valid)return;onLoad(parseValidatedFEN(value));onClose()};
 return <div className="editor-backdrop" role="dialog" aria-modal="true" aria-label="Load FEN">
  <div className="fen-loader">
   <div className="editor-header"><h2>Load FEN</h2><button type="button" onClick={onClose}>×</button></div>
   <p>Enter a complete six-field FEN position.</p>
   <textarea className="fen-input" value={value} onChange={e=>setValue(e.target.value)} placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" spellCheck={false} autoFocus/>
   {value.trim()&&!result.valid&&<div className="editor-error" role="alert">{result.error}</div>}
   {result.valid&&<div className="fen-valid" role="status">Valid FEN</div>}
   <div className="editor-actions"><button type="button" onClick={onClose}>Cancel</button><button type="button" disabled={!result.valid} onClick={load}>Load Position</button></div>
  </div>
 </div>;
}
