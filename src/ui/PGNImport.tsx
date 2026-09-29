import {useRef,useState} from 'react';
import {parsePGN} from '../app/importExport';
import type {ChessGame} from '../core/game';

type Props={onApply:(game:ChessGame)=>void;onClose:()=>void};

export default function PGNImport({onApply,onClose}:Props){
 const [text,setText]=useState('');
 const [error,setError]=useState('');
 const inputRef=useRef<HTMLInputElement>(null);
 const load=()=>{try{const parsed=parsePGN(text);onApply(parsed.game);onClose()}catch(e){setError(e instanceof Error?e.message:'Invalid PGN')}};
 const readFile=async(file:File)=>{setText(await file.text());setError('')};
 return <div className="editor-backdrop" role="dialog" aria-modal="true" aria-label="Import PGN">
  <div className="position-editor">
   <div className="editor-header"><h2>Import PGN</h2><button type="button" onClick={onClose}>×</button></div>
   <label>PGN<textarea value={text} onChange={e=>{setText(e.target.value);setError('')}} placeholder={'[Event "Local"]\n\n1. e4 e5 *'}/></label>
   <input ref={inputRef} type="file" accept=".pgn,application/x-chess-pgn,text/plain" onChange={e=>{const file=e.target.files?.[0];if(file)void readFile(file)}} />
   {error&&<div className="editor-error" role="alert">{error}</div>}
   <div className="editor-actions"><button type="button" onClick={()=>inputRef.current?.click()}>Choose PGN file</button><button type="button" onClick={load} disabled={!text.trim()}>Import game</button></div>
  </div>
 </div>;
}
