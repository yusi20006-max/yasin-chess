import type {ReactNode} from 'react';

type GameLayoutProps = {
  board: ReactNode;
  panel: ReactNode;
};

export default function GameLayout({board, panel}: GameLayoutProps) {
  return (
    <section className="game-layout" data-layout="chess-game" aria-label="Chess game" aria-describedby="chess-game-help">
      <div className="board-column"><p id="chess-game-help" className="sr-only">Use Enter or Space on a square to select or move a piece. Press Escape to clear the current selection.</p>{board}</div>
      <aside className="game-panel">{panel}</aside>
    </section>
  );
}
