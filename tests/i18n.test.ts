import {describe,expect,it} from 'vitest';
import {applyLocale,messages,translate} from '../src/app/i18n';

describe('localization contract',()=>{
 it('has matching fa/en message keys',()=>expect(Object.keys(messages.fa).sort()).toEqual(Object.keys(messages.en).sort()));
 it('returns deterministic translations',()=>{expect(translate('fa','undo')).toBe('واگرد');expect(translate('en','undo')).toBe('Undo')});
 it('applies language direction',()=>{document.documentElement.lang='x';document.documentElement.dir='x';applyLocale('fa');expect(document.documentElement.lang).toBe('fa');expect(document.documentElement.dir).toBe('rtl');applyLocale('en');expect(document.documentElement.lang).toBe('en');expect(document.documentElement.dir).toBe('ltr')});
});
