import {writeFileSync} from 'node:fs';
import {ChessGame} from '../src/core/game';
import {searchBestMove} from '../src/engine/minimax';
const positions=[
 ['tactical','4k3/8/8/3q4/3Q4/8/4K3/8 w - - 0 1'],
 ['middlegame','r2q1rk1/ppp1bppp/2np1n2/8/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1'],
 ['endgame','4k3/8/8/8/8/8/4K3/R7 w - - 0 1']
];
const rows=positions.map(([name,fen])=>{const game=new ChessGame(fen);const started=performance.now();const result=searchBestMove(game.position,8,{timeBudgetMs:500});return {name,elapsedMs:Number((performance.now()-started).toFixed(2)),nodes:result.nodes,completedDepth:result.depth,timedOut:result.timedOut,move:result.move}});
console.log(JSON.stringify({generatedAt:new Date().toISOString(),budgetMs:500,positions:rows},null,2));
