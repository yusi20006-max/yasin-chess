export type BoardTheme={light:string;dark:string;piece:string};
const KEY='yasin-chess.board-theme';
export const DEFAULT_BOARD_THEME:BoardTheme={light:'#f0d9b5',dark:'#b58863',piece:'#111827'};
export function loadBoardTheme():BoardTheme{try{const raw=localStorage.getItem(KEY);return raw?{...DEFAULT_BOARD_THEME,...JSON.parse(raw)}:DEFAULT_BOARD_THEME}catch{return DEFAULT_BOARD_THEME}}
export function saveBoardTheme(theme:BoardTheme):void{localStorage.setItem(KEY,JSON.stringify(theme))}
