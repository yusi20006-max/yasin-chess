import type {ReactNode} from 'react';

type GameLayoutProps = {
  board: ReactNode;
  panel: ReactNode;
};

export default function GameLayout({board, panel}: GameLayoutProps) {
  return (
    <section className="game-layout" aria-label="Chess game">
      <div className="board-column">{board}</div>
      <aside className="game-panel">{panel}</aside>
    </section>
  );
}
