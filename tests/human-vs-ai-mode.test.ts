import {describe,expect,it} from 'vitest';import {isHumanTurn} from '../src/app/modes';
describe('human versus AI mode',()=>{it('gives White to the human and Black to AI',()=>{expect(isHumanTurn('human-vs-ai','w')).toBe(true);expect(isHumanTurn('human-vs-ai','b')).toBe(false)})});
