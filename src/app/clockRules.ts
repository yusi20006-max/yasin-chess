import type {ChessClock} from './clock';
export function clockExpired(clock:ChessClock){return clock.expired()}
export function applyMoveClock(clock:ChessClock){if(clock.expired())throw new Error('Time expired');clock.switchTurn()}
export function pauseClock(clock:ChessClock){clock.pause()}
export function resumeClock(clock:ChessClock){clock.start()}
