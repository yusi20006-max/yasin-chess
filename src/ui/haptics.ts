import { Haptics, ImpactStyle } from '@capacitor/haptics';

let enabled=true;
export function setHapticsEnabled(value:boolean){enabled=value}
export function isHapticsEnabled(){return enabled}

export function haptic(pattern:number|number[]=10){
  if(!enabled) return false;
  if(typeof navigator!=='undefined' && typeof navigator.vibrate==='function'){
    (navigator.vibrate as unknown as (value:number|number[])=>boolean).call(navigator,pattern);
    return true;
  }
  Haptics.impact({style: ImpactStyle.Light}).catch(()=>{});
  return true;
}
