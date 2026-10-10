import {BOARD_THEMES,type BoardTheme} from './boardSettings';
import {translate,type Locale} from '../app/i18n';

type Props={value:BoardTheme;onChange:(theme:BoardTheme)=>void;locale?:Locale};

export default function BoardThemeSelector({value,onChange,locale='fa'}:Props){
 const active=Object.entries(BOARD_THEMES).find(([,theme])=>theme.light===value.light&&theme.dark===value.dark)?.[0];
 const labels=locale==='fa'?{midnight:'نیمه‌شب',ocean:'اقیانوس',violet:'بنفش',classic:'کلاسیک',emerald:'زمردی'}:{midnight:'Midnight',ocean:'Ocean',violet:'Violet',classic:'Classic',emerald:'Emerald'};
 return <div className="board-theme-selector" role="group" aria-label={translate(locale,'boardThemes')}>
  {Object.entries(BOARD_THEMES).map(([id,theme])=><button key={id} type="button" className={active===id?'active':''} aria-pressed={active===id} onClick={()=>onChange(theme)}>
   <span className="theme-swatch" aria-hidden="true"><i style={{background:theme.light}}/><i style={{background:theme.dark}}/></span>
   <span>{labels[id as keyof typeof labels]}</span>
  </button>)}
 </div>;
}
