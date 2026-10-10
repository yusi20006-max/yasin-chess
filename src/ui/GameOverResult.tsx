import type {GameStatus} from '../core/types';
import {translate,type Locale} from '../app/i18n';

type Props={status:GameStatus;turn:'w'|'b';gameMode:'human-vs-ai'|'human-vs-human'|'ai-vs-ai';locale:Locale;onNewGame:()=>void;onReview:()=>void;onAnalyze:()=>void;analysisRunning:boolean};

function title(status:GameStatus,locale:Locale){
 const key=status==='checkmate'?'checkmate':status==='stalemate'?'stalemate':status==='draw-repetition'||status==='draw-insufficient'||status==='draw-75-move'||status==='claim-50-move'||status==='draw-agreement'?'draw':'gameOver';
 return translate(locale,key);
}
function result(status:GameStatus,turn:'w'|'b',locale:Locale){
 if(status==='checkmate')return turn==='w'?translate(locale,'blackWins'):translate(locale,'whiteWins');
 return '½ – ½';
}

export default function GameOverResult({status,turn,gameMode,locale,onNewGame,onReview,onAnalyze,analysisRunning}:Props){
 const winner=status==='checkmate'?(turn==='w'?translate(locale,'blackWins'):translate(locale,'whiteWins')):null;
 const message=winner?winner+' '+translate(locale,'winsByCheckmate')+'.':translate(locale,'gameEndedReview');
 return <div className={'game-over game-over-result game-over-'+status} role="dialog" aria-modal="true" aria-labelledby="game-over-title">
  <div className="game-over-kicker">YASIN CHESS</div>
  <h2 id="game-over-title">{title(status,locale)}</h2>
  <strong className="game-over-score">{result(status,turn,locale)}</strong>
  <p>{message}</p>
  <div className="game-over-actions"><button type="button" onClick={onReview}>{translate(locale,'reviewMoves')}</button><button type="button" onClick={onAnalyze} disabled={analysisRunning}>{analysisRunning?translate(locale,'analyzing')+'…':translate(locale,'analyzeMoves')}</button><button type="button" onClick={onNewGame}>{translate(locale,'newGame')}</button></div>
  <span className="sr-only">{translate(locale,'gameMode')}: {translate(locale,gameMode==='ai-vs-ai'?'aiVsAi':gameMode==='human-vs-ai'?'humanVsAi':'humanVsHuman')}</span>
 </div>;
}
