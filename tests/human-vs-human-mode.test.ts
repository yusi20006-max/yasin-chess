import {describe,expect,it} from 'vitest';import {isHumanTurn} from '../src/app/modes';
describe('human versus human mode',()=>{it('allows both colors to move',()=>{expect(isHumanTurn('human-vs-human','w')).toBe(true);expect(isHumanTurn('human-vs-human','b')).toBe(true)})});
