type GameControlsProps = {
  onUndo: () => void;
  onRedo: () => void;
  onForce?: () => void;
  onNewGame: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canForce: boolean;
  labels: {undo: string; redo: string; force: string; newGame: string};
};

export default function GameControls({
  onUndo,
  onRedo,
  onForce,
  onNewGame,
  canUndo,
  canRedo,
  canForce,
  labels,
}: GameControlsProps) {
  return (
    <div className="controls" data-component="game-controls" role="group" aria-label="Game controls">
      <button type="button" onClick={onUndo} disabled={!canUndo}>{labels.undo}</button>
      <button type="button" onClick={onForce} disabled={!canForce}>{labels.force}</button>
      <button type="button" onClick={onRedo} disabled={!canRedo}>{labels.redo}</button>
      <button type="button" onClick={onNewGame}>{labels.newGame}</button>
    </div>
  );
}
