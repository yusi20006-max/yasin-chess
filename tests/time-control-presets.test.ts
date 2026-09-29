import {describe,expect,it} from 'vitest';
import {DEFAULT_SETTINGS,TIME_CONTROL_PRESETS,validateSettings} from '../src/app/settings';
describe('time control presets',()=>{it('ships deterministic presets',()=>{expect(TIME_CONTROL_PRESETS.map(x=>x.label)).toEqual(['1+0','3+2','5+0','10+0']);expect(DEFAULT_SETTINGS.timeControl.label).toBe('5+0')});it('accepts settings without a legacy timeControl field',()=>{const legacy={...DEFAULT_SETTINGS};delete (legacy as Partial<typeof legacy>).timeControl;expect(validateSettings(legacy)).toBe(true)})});
