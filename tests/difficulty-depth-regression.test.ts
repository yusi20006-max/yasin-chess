import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe,expect,it} from 'vitest';
import {DIFFICULTIES,difficulty} from '../src/engine/difficulty';
import {chooseMove} from '../src/engine/minimax';
import {initialPosition} from '../src/core/board';
import {ChessGame} from '../src/core/game';
import {legalMoves} from '../src/core/moves';

type Level=typeof DIFFICULTIES[number]['id'];
/** Mirrors src/ui/App.tsx's difficulty memo exactly, so this test fails whenever
 * the App expression regresses to an explicit `depth: undefined` override. */
const appDifficulty=(level:Level,customDepth:number)=>difficulty(level,level==='custom'?{depth:customDepth}:{});
const appSource=()=>readFileSync(resolve(process.cwd(),'src/ui/App.tsx'),'utf8');

describe('AI difficulty depth resolution (regression: depth must never be undefined)',()=>{
  it('keeps the preset depth for every non-custom difficulty',()=>{
    for(const preset of DIFFICULTIES.filter(x=>x.id!=='custom')){
      const d=appDifficulty(preset.id,8);
      expect(d.depth).toBe(preset.depth);
      expect(typeof d.depth).toBe('number');
      expect(Number.isFinite(d.depth)).toBe(true);
      expect(d.elo).toBe(preset.elo);
    }
  });

  it('uses the custom slider depth when the custom difficulty is selected',()=>{
    expect(appDifficulty('custom',3).depth).toBe(3);
    expect(appDifficulty('custom',8).depth).toBe(8);
  });

  it('passes a usable depth to the effect guard and to chooseMove',()=>{
    for(const preset of DIFFICULTIES){
      const d=appDifficulty(preset.id,8);
      // App.tsx effect guard: game.position.turn!=='b' || d.depth<=0 -> skip
      expect(d.depth>0).toBe(true);
      // App.tsx chooseMove(snapshot.position, d.depth) must not recurse forever
      const move=chooseMove(initialPosition(),d.depth);
      expect(move).toBeDefined();
    }
  });

  it('produces a legal reply for the real post-1.c4 AI turn (no opening book)',()=>{
    const game=new ChessGame();
    game.play(legalMoves(game.position).find(m=>m.from===10&&m.to===26)!);
    const move=chooseMove(game.position,appDifficulty('beginner',8).depth);
    expect(move).toBeDefined();
    expect(()=>game.clone().play(move!)).not.toThrow();
    expect(game.clone().play(move!).length).toBeGreaterThan(0);
  });

  it('legacy override shape would silently clobber depth — guards the actual bug',()=>{
    // This is the pre-fix expression: an explicit `depth: undefined` override
    // spreads over the preset and erases its depth.
    const broken=difficulty('beginner',{depth:undefined});
    expect(broken.depth).toBeUndefined();
    expect(appDifficulty('beginner',8).depth).toBe(2);
  });

  it('App.tsx never builds a difficulty override containing depth:undefined',()=>{
    const src=appSource();
    const memo=src.match(/difficulty\([^)]*\)/);
    expect(memo).not.toBeNull();
    expect(memo![0]).not.toContain('depth:undefined');
    expect(memo![0]).not.toContain('depth: undefined');
    expect(src).toContain("level==='custom'?{depth:customDepth}:{}");
  });

  it('App.tsx passes a finite depth to the AI controller call sites',()=>{
    const src=appSource();
    const calls=[...src.matchAll(/requestAiTurn\\(\\{position:snapshot\\.position,depth:d\\.depth,signal:controller\\.signal\\}\\)/g)];
    expect(calls.length).toBeGreaterThan(0);
    expect(src).toContain('d.depth<=0');
    expect(src).toContain("requestAiTurn({position:snapshot.position,depth:d.depth,signal:controller.signal})");
  });
});
