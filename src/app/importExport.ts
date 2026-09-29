import {fromFEN,toFEN} from '../core/board';
import type {Position} from '../core/types';
import {ChessGame} from '../core/game';
import {legalMoves} from '../core/moves';
import {toSAN} from '../core/san';

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
  const withoutComments=text.replace(/\{[^}]*\}/gs,'').replace(/;[^\r\n]*/g,'');
  let variationDepth=0;
  for(const ch of withoutComments){
    if(ch==='(')variationDepth++;
    else if(ch===')'){variationDepth--;if(variationDepth<0)return {valid:false,error:'PGN has an unmatched variation close'};}
  }
  if(variationDepth!==0)return {valid:false,error:'PGN has an unclosed variation'};
  const tags=[...text.matchAll(/^\s*\[([A-Za-z][A-Za-z0-9_]*)\s+"((?:[^"\\]|\\.)*)"\]\s*$/gm)];
  const tagBlock=text.match(/^(?:\s*\[[^\r\n]+\]\s*)+/);
  if(tagBlock){
    const lines=tagBlock[0].split(/\r?\n/).filter(Boolean);
    for(const line of lines)if(!/^\[[A-Za-z][A-Za-z0-9_]*\s+"(?:[^"\\]|\\.)*"\]$/.test(line.trim()))return {valid:false,error:'PGN tag header is malformed'};
  }
  const body=text.slice(tagBlock?.[0].length??0).replace(/\{[^}]*\}/gs,'').replace(/;[^\r\n]*/g,'').replace(/\([^)]*\)/g,' ');
  const tokens=body.split(/\s+/).filter(Boolean);
  const resultTokens=new Set(['1-0','0-1','1/2-1/2','*']);
  let hasMove=false,hasResult=false;
  for(const token of tokens){
    if(/^\d+\.(?:\.\.)?$/.test(token)||/^\d+\.\.\.$/.test(token))continue;
    if(resultTokens.has(token)){hasResult=true;continue}
    if(/^\$\d+$/.test(token))continue;
    if(!/^(?:O-O|O-O-O|0-0|0-0-0|[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](?:=[QRBN])?[+#]?|[a-h](?:x[a-h][1-8])?(?:=[QRBN])?[+#]?)$/.test(token))return {valid:false,error:'PGN token is malformed: '+token};
    hasMove=true;
  }
  if(!hasMove){const setup=tags.find(x=>x[1]==='SetUp')?.[2];const fenHeader=tags.find(x=>x[1]==='FEN')?.[2];if(!(setup==='1'&&Boolean(fenHeader)&&hasResult))return {valid:false,error:'PGN contains no moves'};}
  if(!hasResult)return {valid:false,error:'PGN is missing a result token'};
  const resultTag=tags.find(x=>x[1]==='Result')?.[2];
  if(resultTag&&resultTag!==tokens[tokens.length-1]&&resultTag!=='*')return {valid:false,error:'PGN Result tag does not match movetext result'};
  return {valid:true};
}

export function positionToFEN(position:Position):string{return toFEN(position);}

export type ParsedPGN={game:ChessGame;headers:Record<string,string>;result:string};

function stripPGNCommentsAndVariations(input:string):string{
  let out='',comment=false,variation=0;
  for(let i=0;i<input.length;i++){
    const ch=input[i];
    if(comment){if(ch==='}')comment=false;continue}
    if(ch==='{'){comment=true;continue}
    if(ch===';'){while(i<input.length&&input[i]!=='\n')i++;continue}
    if(ch==='('){variation++;continue}
    if(ch===')'){if(variation>0)variation--;continue}
    if(variation===0)out+=ch;
  }
  return out;
}

export function parsePGN(input:string):ParsedPGN{
  const validation=validatePGN(input);
  if(!validation.valid)throw new Error(validation.error);
  const text=input.replace(/^\uFEFF/,'').trim();
  const headers:Record<string,string>={};
  for(const match of text.matchAll(/^\s*\[([A-Za-z][A-Za-z0-9_]*)\s+"((?:[^"\\]|\\.)*)"\]\s*$/gm)){
    headers[match[1]]=match[2].replace(/\\"/g,'"').replace(/\\\\/g,'\\');
  }
  const startFEN=headers.SetUp==='1'&&headers.FEN?headers.FEN:undefined;
  if(startFEN&&!validateFEN(startFEN).valid)throw new Error('PGN FEN header is invalid');
  const game=new ChessGame(startFEN);
  const body=stripPGNCommentsAndVariations(text.replace(/^(?:\s*\[[^\r\n]+\]\s*)+/,''));
  const tokens=body.split(/\s+/).filter(Boolean);
  let result='*';
  for(const raw of tokens){
    const token=raw.replace(/\$\d+$/,'');
    if(/^\d+\.(?:\.\.)?$/.test(token)||/^\d+\.\.\.$/.test(token))continue;
    if(['1-0','0-1','1/2-1/2','*'].includes(token)){result=token;continue}
    const normalized=token.replace(/^0-0-0/,'O-O-O').replace(/^0-0/,'O-O');
    const move=legalMoves(game.position).find(candidate=>toSAN(game.position,candidate)===normalized);
    if(!move)throw new Error('Illegal or unsupported PGN move: '+raw);
    game.play(move);
  }
  const headerResult=headers.Result;
  if(headerResult&&headerResult!==result)throw new Error('PGN Result tag does not match movetext result');
  return {game,headers,result};
}
