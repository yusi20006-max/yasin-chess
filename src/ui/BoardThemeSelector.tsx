import {BOARD_THEMES,type BoardTheme} from './boardSettings';

type Props={value:BoardTheme;onChange:(theme:BoardTheme)=>void};

const LABELS:Record<string,string>={midnight:'Midnight',ocean:'Ocean',violet:'Violet',classic:'Classic',emerald:'Emerald'};

export default function BoardThemeSelector({value,onChange}:Props){
  const active=Object.entries(BOARD_THEMES).find(([,theme])=>theme.light===value.light&&theme.dark===value.dark)?.[0];
  return <div className="board-theme-selector" role="group" aria-label="Board Themes">
    {Object.entries(BOARD_THEMES).map(([id,theme])=><button key={id} type="button" className={active===id?'active':''} aria-pressed={active===id} onClick={()=>onChange(theme)}>
      <span className="theme-swatch" aria-hidden="true"><i style={{background:theme.light}}/><i style={{background:theme.dark}}/></span>
      <span>{LABELS[id]}</span>
    </button>)}
  </div>;
}
