import {ChessGame} from '../core/game';import {aiStep} from './modes';
export function playAIMatch(depthWhite:number,depthBlack:number,maxPlies=300){const game=new ChessGame();for(let i=0;i<maxPlies&&game.status()==='playing'||i<maxPlies&&game.status()==='check';i++){if(!aiStep(game,game.position.turn==='w'?depthWhite:depthBlack))break}return game}
