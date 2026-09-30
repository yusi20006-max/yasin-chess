type GameStatusProps = {
  status: string;
  statusLabel: string;
  thinking?: boolean;
  thinkingText?: string;
  idleText?: string;
  thinkingElapsedSec?: number;
};

export default function GameStatus({
  status,
  statusLabel,
  thinking = false,
  thinkingText = 'Thinking',
  idleText = 'Idle',
  thinkingElapsedSec = 0,
}: GameStatusProps) {
  return (
    <div data-component="game-status">
      <div className="thinking" role="status" aria-live="polite">
        {thinking ? `${thinkingText} · ${thinkingElapsedSec.toFixed(1)}s` : idleText}
      </div>
      <div className={`status status-${status}`} role="status" data-status={status}>
        وضعیت: <b>{statusLabel}</b>
      </div>
    </div>
  );
}
