import {describe,expect,it} from 'vitest';
import {isRecoverableGame,selectRecoverySnapshot} from '../src/storage/recovery';

const valid=()=>({
  id:'active',schemaVersion:2,updatedAt:10,startFEN:'7k/8/8/8/8/8/2B5/2K5 w - - 0 1',
  position:{board:Array(64).fill(null),turn:'w',castling:{wK:false,wQ:false,bK:false,bQ:false},ep:null,halfmove:0,fullmove:1},
  history:[],future:[],keys:[]
});

describe('corrupted storage recovery',()=>{
  it('accepts a structurally and semantically valid snapshot',()=>{
    expect(isRecoverableGame(valid())).toBe(true);
  });
  it('rejects corrupted board shape and invalid FEN',()=>{
    const badBoard={...valid(),position:{...valid().position,board:Array(63).fill(null)}};
    const badFen={...valid(),startFEN:'not a fen'};
    expect(isRecoverableGame(badBoard)).toBe(false);
    expect(isRecoverableGame(badFen)).toBe(false);
  });
  it('ignores a newer corrupted primary and recovers the valid backup',()=>{
    const backup=valid();
    const primary={...valid(),updatedAt:99,position:{...valid().position,board:Array(3).fill(null)}};
    expect(selectRecoverySnapshot(primary,backup)?.updatedAt).toBe(10);
  });
});
