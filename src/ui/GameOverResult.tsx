import type {GameStatus} from '../core/types';

type Props={status:GameStatus;turn:'w'|'b';gameMode:'human-vs-ai'|'human-vs-human'|'ai-vs-ai';onNewGame:()=>void;onReview:()=>void;onAnalyze:()=>void;analysisRunning:boolean};

function title(status:GameStatus){if(status==='checkmate')return 'Checkmate';if(status==='stalemate')return 'Draw · Stalemate';if(status==='draw-repetition')return 'Draw · Repetition';if(status==='draw-insufficient')return 'Draw · Insufficient material';if(status==='draw-75-move')return 'Draw · 75-move rule';if(status==='claim-50-move')return 'Draw · 50-move claim';if(status==='draw-agreement')return 'Draw · Agreement';return 'Game over'}
function result(status:GameStatus,turn:'w'|'b'){if(status==='checkmate')return turn==='w'?'Black wins':'White wins';return '½ – ½'}

export default function GameOverResult({status,turn,gameMode,onNewGame,onReview,onAnalyze,analysisRunning}:Props){
  const winner=status==='checkmate'?(turn==='w'?'Black':'White'):null;
  return <div className={'game-over game-over-result game-over-'+status} role="dialog" aria-modal="true" aria-labelledby="game-over-title">
    <div className="game-over-kicker">YASIN CHESS</div>
    <h2 id="game-over-title">{title(status)}</h2>
    <strong className="game-over-score">{result(status,turn)}</strong>
    <p>{winner?winner+' wins by checkmate.':'The game has ended. Review the moves or start a new game.'}</p>
    <div className="game-over-actions"><button type="button" onClick={onReview}>Review moves</button><button type="button" onClick={onAnalyze} disabled={analysisRunning}>{analysisRunning?'Analyzing…':'Analyze moves'}</button><button type="button" onClick={onNewGame}>New game</button></div>
    <span className="sr-only">Mode: {gameMode}</span>
  </div>;
}
