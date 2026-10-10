import type {ReactNode} from 'react';
import type {Locale} from '../app/i18n';

type GameLayoutProps={board:ReactNode;panel:ReactNode;top?:ReactNode;bottom?:ReactNode;locale?:Locale};

export default function GameLayout({board,panel,top,bottom,locale='fa'}:GameLayoutProps){
 const fa=locale==='fa';
 return <section className="game-layout" data-layout="chess-game" data-component="game-layout" aria-label={fa?'بازی شطرنج':'Chess game'} aria-describedby="chess-game-help">
  {top}
  <div className="board-column">
   <p id="chess-game-help" className="sr-only">{fa?'برای انتخاب یا حرکت مهره، روی یک خانه Enter یا Space را بزنید. برای لغو انتخاب، Escape را بزنید.':'Use Enter or Space on a square to select or move a piece. Press Escape to clear the current selection.'}</p>
   {board}
  </div>
  <aside className="game-panel">{panel}</aside>
  {bottom}
 </section>;
}
