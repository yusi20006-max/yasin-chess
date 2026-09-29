import {describe,expect,it} from 'vitest';
const format=(ms:number)=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
describe('chess clock UI formatting',()=>{it('formats minutes and seconds deterministically',()=>{expect(format(300000)).toBe('5:00');expect(format(59999)).toBe('0:59');expect(format(0)).toBe('0:00')})});
