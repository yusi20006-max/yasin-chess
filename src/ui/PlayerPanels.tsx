type PlayerPanelsProps = {
  turn: 'w' | 'b';
  whiteLabel: string;
  blackLabel: string;
  whiteClock: string;
  blackClock: string;
  whiteStatus: string;
  blackStatus: string;
};

export default function PlayerPanels({
  turn,
  whiteLabel,
  blackLabel,
  whiteClock,
  blackClock,
  whiteStatus,
  blackStatus,
}: PlayerPanelsProps) {
  return (
    <div className="player-panels" data-component="player-panels" role="group" aria-label="Players">
      <div className={`player-card ${turn === 'w' ? 'active' : ''}`} data-turn={turn === 'w' ? 'active' : undefined}>
        <b>{whiteLabel}</b>
        <strong className="player-clock" aria-label={`White ${whiteClock}`}>{whiteClock}</strong>
        <span>{whiteStatus}</span>
      </div>
      <div className={`player-card ${turn === 'b' ? 'active' : ''}`} data-turn={turn === 'b' ? 'active' : undefined}>
        <b>{blackLabel}</b>
        <strong className="player-clock" aria-label={`Black ${blackClock}`}>{blackClock}</strong>
        <span>{blackStatus}</span>
      </div>
    </div>
  );
}
