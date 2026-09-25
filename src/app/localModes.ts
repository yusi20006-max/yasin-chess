import {ChessGame} from '../core/game';import type {GameMode} from './modes';
export function createLocalGame(mode:GameMode='human-vs-human'){if(mode!=='human-vs-human')throw new Error('Use an engine driver for AI modes');return new ChessGame()}
