import {ChessGame} from '../core/game';import {chooseMove} from '../engine/minimax';import type {Color} from '../core/types';
export type GameMode='human-vs-ai'|'human-vs-human'|'ai-vs-ai';
export function isHumanTurn(mode:GameMode,turn:Color){return mode==='human-vs-human'||(mode==='human-vs-ai'&&turn==='w')}
export function aiStep(game:ChessGame,depth:number){const move=chooseMove(game.position,depth);if(!move)return false;game.play(move);return true}
