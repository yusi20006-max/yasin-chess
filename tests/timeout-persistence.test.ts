import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {serializeActiveGame,deserializeActiveGame} from '../src/storage/activeGame';
describe('active game terminal and clock persistence',()=>{
 it('restores clock, time control, and timeout result after serialization',()=>{const game=new ChessGame();game.flagFall('w');const restored=deserializeActiveGame(serializeActiveGame(game,{w:0,b:42000},'blitz-3'));expect(restored.game.status()).toBe('timeout');expect(restored.game.resultToken()).toBe('0-1');expect(restored.clockMs).toEqual({w:0,b:42000});expect(restored.timeControlId).toBe('blitz-3')});
 it('restores an accepted draw claim instead of reopening the game',()=>{const game=new ChessGame('8/8/8/8/8/8/R6k/K7 w - - 100 51');game.claimFiftyMoveDraw();const restored=deserializeActiveGame(serializeActiveGame(game,{w:30000,b:30000},'rapid-5'));expect(restored.game.status()).toBe('draw-agreement');expect(restored.game.resultToken()).toBe('1/2-1/2')});
 it('keeps legacy snapshots loadable with default terminal state',()=>{const snapshot=serializeActiveGame(new ChessGame());snapshot.schemaVersion=3;delete snapshot.terminalState;const restored=deserializeActiveGame(snapshot);expect(restored.game.status()).toBe('playing');expect(restored.game.resultToken()).toBe('*')});
});
