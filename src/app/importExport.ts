import {fromFEN,toFEN} from '../core/board';
import type {Position} from '../core/types';

export type ValidationResult={valid:true}|{valid:false;error:string};

export function validateFEN(input:string):ValidationResult{
  if(typeof input!=='string'||!input.trim())return {valid:false,error:'FEN is empty'};
  try{fromFEN(input.trim());return {valid:true}}catch(error){return {valid:false,error:error instanceof Error?error.message:'Invalid FEN'}};
}

export function parseValidatedFEN(input:string):Position{
  const result=validateFEN(input);
  if(!result.valid)throw new Error(result.error);
  return fromFEN(input.trim());
}

export function validatePGN(input:string):ValidationResult{
  if(typeof input!=='string'||!input.trim())return {valid:false,error:'PGN is empty'};
  const text=input.replace(/^\uFEFF/,'').trim();
  let commentDepth=0;
  for(const ch of text){if(ch==='{')commentDepth++;else if(ch==='}')commentDepth--;}
  if(commentDepth!==0)return {valid:false,error:'PGN has an unclosed comment'};
  const withoutComments=text.replace(/\{[^}]*\}/gs,'').replace(/;[^\r
]*/g,'');
  let variationDepth=0;
  for(const ch of withoutComments){
    if(ch==='(')variationDepth++;
    else if(ch===')'){variationDepth--;if(variationDepth<0)return {valid:false,error:'PGN has an unmatched variation close'};}
  }
  if(variationDepth!==0)return {valid:false,error:'PGN has an unclosed variation'};
  const tags=[...text.matchAll(/^\s*\[([A-Za-z][A-Za-z0-9_]*)\s+"((?:[^"\\]|\\.)*)"\]\s*$/gm)];
  const tagBlock=text.match(/^(?:\s*\[[^\r
]+\]\s*)+/);
  if(tagBlock){
    const lines=tagBlock[0].split(/\r?
/).filter(Boolean);
    for(const line of lines)if(!/^\[[A-Za-z][A-Za-z0-9_]*\s+"(?:[^"\\]|\\.)*"\]$/.test(line.trim()))return {valid:false,error:'PGN tag header is malformed'};
  }
  const body=text.slice(tagBlock?.[0].length??0).replace(/\{[^}]*\}/gs,'').replace(/;[^\r
]*/g,'').replace(/\([^)]*\)/g,' ');
  const tokens=body.split(/\s+/).filter(Boolean);
  const resultTokens=new Set(['1-0','0-1','1/2-1/2','*']);
  let hasMove=false,hasResult=false;
  for(const token of tokens){
    if(/^\d+\.(?:\.\.)?$/.test(token)||/^\d+\.\.\.$/.test(token))continue;
    if(resultTokens.has(token)){hasResult=true;continue}
    if(/^\$\d+$/.test(token))continue;
    if(!/^(?:O-O|O-O-O|0-0|0-0-0|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[+#]?|[a-h](?:x[a-h][1-8])?(?:=[QRBN])?[+#]?)$/.test(token))return {valid:false,error:`PGN token is malformed: ${token}`};
    hasMove=true;
  }
  if(!hasMove)return {valid:false,error:'PGN contains no moves'};
  if(!hasResult)return {valid:false,error:'PGN is missing a result token'};
  const resultTag=tags.find(x=>x[1]==='Result')?.[2];
  if(resultTag&&resultTag!==tokens[tokens.length-1]&&resultTag!=='*')return {valid:false,error:'PGN Result tag does not match movetext result'};
  return {valid:true};
}

export function positionToFEN(position:Position):string{return toFEN(position);}
