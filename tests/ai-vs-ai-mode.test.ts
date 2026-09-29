import {describe,expect,it} from 'vitest';
import {isHumanTurn} from '../src/app/modes';
describe('AI versus AI mode',()=>{it('has no human turns',()=>{expect(isHumanTurn('ai-vs-ai','w')).toBe(false);expect(isHumanTurn('ai-vs-ai','b')).toBe(false)});it('keeps human versus AI white-controlled',()=>{expect(isHumanTurn('human-vs-ai','w')).toBe(true);expect(isHumanTurn('human-vs-ai','b')).toBe(false)})});
