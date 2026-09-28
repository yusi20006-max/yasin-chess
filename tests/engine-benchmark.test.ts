import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {searchBestMove} from '../src/engine/minimax';
describe('engine benchmark fixtures',()=>{
 it('uses non-opening representative positions',()=>{
  const fens=['4k3/8/8/3q4/3Q4/8/4K3/8 w - - 0 1','r2q1rk1/ppp1bppp/2np1n2/8/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - - 0 1','4k3/8/8/8/8/8/4K3/R7 w - - 0 1'];
  for(const fen of fens){const result=searchBestMove(new ChessGame(fen).position,6,{timeBudgetMs:50});expect(result.move).toBeDefined();expect(result.nodes).toBeGreaterThan(0)}
 });
});
