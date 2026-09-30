import type {Move, Promotion, Color} from '../core/types';
import Piece from './Piece';

type PromotionDialogProps = {
  moves: Move[];
  turn: Color;
  title: string;
  onChoose: (move: Move) => void;
  onCancel?: () => void;
};

const ORDER: Promotion[] = ['q', 'r', 'b', 'n'];

export default function PromotionDialog({moves, turn, title, onChoose, onCancel}: PromotionDialogProps) {
  return (
    <div className="promotion-backdrop" role="dialog" aria-modal="true" aria-label={title} data-component="promotion-dialog">
      <div className="promotion-dialog">
        <h2>{title}</h2>
        <div className="promotion-choices">
          {ORDER.map((type) => {
            const move = moves.find((m) => m.promotion === type);
            return (
              <button
                key={type}
                type="button"
                className="promotion-choice"
                disabled={!move}
                onClick={() => move && onChoose(move)}
                aria-label={type}
              >
                <Piece piece={{color: turn, type}} />
              </button>
            );
          })}
        </div>
        {onCancel && (
          <button type="button" className="promotion-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
