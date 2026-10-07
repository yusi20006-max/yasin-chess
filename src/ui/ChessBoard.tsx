import {memo, type ReactNode} from 'react';
import type {Position, Square} from '../core/types';
import {squareName} from '../core/board';
import {boardRanks, boardFiles, fileLabel, rankLabel} from './boardCoordinates';
import type {Locale} from '../app/i18n';
import './board.css';

type Props = {
  position: Position;
  selected: Square | null;
  highlights: Set<Square>;
  onSquareClick: (square: Square) => void;
  onSquareDrag?: (from: Square, to: Square) => void;
  onEscape?: () => void;
  renderPiece: (square: Square) => ReactNode;
  orientation?: 'white' | 'black';
  lastMove?: {from: Square; to: Square};
  checkSquare?: Square | null;
  showCoordinates?: boolean;
  locale?: Locale;
};

function ChessBoard({
  position,
  selected,
  highlights,
  onSquareClick,
  onSquareDrag,
  onEscape,
  renderPiece,
  orientation = 'white',
  lastMove,
  checkSquare,
  showCoordinates = true,
  locale = 'fa',
}: Props) {
  const ranks = boardRanks(orientation);
  const files = boardFiles(orientation);

  return (
    <div
      className={`board-wrapper${showCoordinates ? ' with-coords' : ''}`}
      data-orientation={orientation}
      data-component="board-wrapper"
    >
      {showCoordinates && (
        <div className="rank-coords" aria-hidden="true">
          {ranks.map((rank) => (
            <span key={`rank-${rank}`} className="coord coord-rank">
              {rankLabel(rank)}
            </span>
          ))}
        </div>
      )}

      <div
        className="chess-board"
        role="grid"
        aria-label={locale==='fa'?'صفحه شطرنج':'Chess board'}
        aria-roledescription="chess board"
        data-orientation={orientation}
        data-component="chess-board"
      >
        {ranks.flatMap((rank) =>
          files.map((file) => {
            const s = rank * 8 + file;
            const isLight = (rank + file) % 2 === 0;
            const classes = [
              'square',
              isLight ? 'light' : 'dark',
              selected === s ? 'selected' : '',
              highlights.has(s) ? 'hint' : '',
              lastMove?.from === s || lastMove?.to === s ? 'last-move' : '',
              lastMove?.from === s ? 'move-origin' : '',
              lastMove?.to === s ? 'move-destination' : '',
              checkSquare === s ? 'in-check' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                type="button"
                key={s}
                className={classes}
                role="gridcell"
                draggable={Boolean(position.board[s])}
                onDragStart={(e) => e.dataTransfer.setData('text/plain', String(s))}
                onDragOver={(e) => {
                  if (highlights.has(s)) e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const from = Number(e.dataTransfer.getData('text/plain'));
                  if (Number.isInteger(from)) onSquareDrag?.(from, s);
                }}
                aria-selected={selected === s}
                aria-current={lastMove?.from === s || lastMove?.to === s ? 'true' : undefined}
                aria-label={`${squareName(s)}${position.board[s]?` ${locale==='fa'?(position.board[s]?.color==='w'?'سفید':'سیاه')+' '+pieceTypeLabel(position.board[s]?.type,locale):(position.board[s]?.color==='w'?'white':'black')+' '+position.board[s]?.type}`:''}${selected===s?(locale==='fa'?' انتخاب‌شده':' selected'):''}${highlights.has(s)?(locale==='fa'?' حرکت قانونی':' legal move'):''}${checkSquare===s?(locale==='fa'?' در کیش':' in check'):''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') onEscape?.();
                }}
                onClick={() => onSquareClick(s)}
                data-square={squareName(s)}
              >
                {renderPiece(s)}
              </button>
            );
          }),
        )}
      </div>

      {showCoordinates && (
        <div className="file-coords" aria-hidden="true">
          {files.map((file) => (
            <span key={`file-${file}`} className="coord coord-file">
              {fileLabel(file)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function pieceTypeLabel(type:string|undefined,locale:Locale){
 if(locale==='en')return type??'';
 return type==='p'?'پیاده':type==='n'?'اسب':type==='b'?'فیل':type==='r'?'رخ':type==='q'?'وزیر':type==='k'?'شاه':'';
}

export default memo(
  ChessBoard,
  (a, b) =>
    a.position === b.position &&
    a.selected === b.selected &&
    a.highlights === b.highlights &&
    a.orientation === b.orientation &&
    a.lastMove === b.lastMove &&
    a.checkSquare === b.checkSquare &&
    a.renderPiece === b.renderPiece &&
    a.showCoordinates === b.showCoordinates &&
    a.locale === b.locale,
);
