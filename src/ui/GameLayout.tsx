import type {ReactNode} from 'react';

type GameLayoutProps = {
  board: ReactNode;
  panel: ReactNode;
  top?: ReactNode;
  bottom?: ReactNode;
};

/**
 * Professional game screen layout (Phase 5 / #46).
 * Mobile-first: board primary, panel secondary; adapts on larger screens.
 */
export default function GameLayout({board, panel, top, bottom}: GameLayoutProps) {
  return (
    <section
      className="game-layout"
      data-layout="chess-game"
      data-component="game-layout"
      aria-label="Chess game"
      aria-describedby="chess-game-help"
    >
      {top}
      <div className="board-column">
        <p id="chess-game-help" className="sr-only">
          Use Enter or Space on a square to select or move a piece. Press Escape to clear the current selection.
        </p>
        {board}
      </div>
      <aside className="game-panel">{panel}</aside>
      {bottom}
    </section>
  );
}
