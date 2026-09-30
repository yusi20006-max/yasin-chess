type GameOverScreenProps = {
  status: string;
  title: string;
  rematchLabel: string;
  onRematch: () => void;
  onReview?: () => void;
  reviewLabel?: string;
};

export default function GameOverScreen({
  status,
  title,
  rematchLabel,
  onRematch,
  onReview,
  reviewLabel = 'Review',
}: GameOverScreenProps) {
  return (
    <div className="game-over" role="dialog" aria-modal="true" aria-label={title} data-component="game-over">
      <strong>{title}</strong>
      <span data-result={status}>{status}</span>
      <div className="game-over-actions">
        <button type="button" onClick={onRematch}>{rematchLabel}</button>
        {onReview && (
          <button type="button" onClick={onReview}>{reviewLabel}</button>
        )}
      </div>
    </div>
  );
}
