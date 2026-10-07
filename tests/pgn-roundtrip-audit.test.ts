import {describe,expect,it} from 'vitest';
import {ChessGame} from '../src/core/game';
import {parsePGN,validatePGN} from '../src/app/importExport';

describe('PGN offline round-trip audit',()=>{
 it('round-trips an active playable game with headers and result marker',()=>{
  const game=new ChessGame();game.play({from:12,to:28});game.play({from:52,to:36});game.play({from:6,to:21});
  const pgn=game.pgn({Event:'Round Trip',Site:'Local',Date:'2026.10.07'});
  const parsed=parsePGN(pgn);
  expect(parsed.headers.Event).toBe('Round Trip');
  expect(parsed.game.history.map(x=>x.san)).toEqual(game.history.map(x=>x.san));
  expect(parsed.result).toBe('*');
 });
 it('accepts standard castling and promotion SAN offline',()=>{
  const whiteCastle=parsePGN('[SetUp "1"]\n[FEN "4k2r/8/8/8/8/8/8/4K2R w Kk - 0 1"]\n[Result "*"]\n\n1. O-O *');
  expect(whiteCastle.game.history.map(x=>x.san)).toEqual(['O-O']);
  const blackCastle=parsePGN('[SetUp "1"]\n[FEN "4k2r/8/8/8/8/8/8/4K2R b Kk - 0 1"]\n[Result "*"]\n\n1... O-O *');
  expect(blackCastle.game.history.map(x=>x.san)).toEqual(['O-O']);
  const promotion=parsePGN('[SetUp "1"]\n[FEN "7k/P7/8/8/8/8/8/6K1 w - - 0 1"]\n[Result "*"]\n\n1. a8=Q+ *');
  expect(promotion.game.history[0].san).toBe('a8=Q+');
 });
 it('preserves result markers and rejects conflicting result headers',()=>{
  expect(parsePGN('[Result "1-0"]\n\n1. e4 e5 1-0').result).toBe('1-0');
  expect(()=>parsePGN('[Result "1-0"]\n\n1. e4 e5 *')).toThrow(/Result tag/);
 });
 it('rejects malformed and incomplete PGN clearly',()=>{
  expect(validatePGN('1. e4 e5')).toEqual({valid:false,error:'PGN is missing a result token'});
  expect(validatePGN('1. e4 {unclosed *')).toEqual({valid:false,error:'PGN has an unclosed comment'});
 });
});
