type ViewControlsProps = {
  onFlip: () => void;
  flipLabel: string;
  extra?: React.ReactNode;
};

export default function ViewControls({onFlip, flipLabel, extra}: ViewControlsProps) {
  return (
    <div className="view-controls" data-component="view-controls" role="toolbar" aria-label="Board view">
      <button className="view-toggle" type="button" onClick={onFlip} aria-label={flipLabel}>
        ↔ {flipLabel}
      </button>
      {extra}
    </div>
  );
}
