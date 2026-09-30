type HistoryEntry = { san: string };

type MoveListProps = {
  history: HistoryEntry[];
  title: string;
};

export default function MoveList({history, title}: MoveListProps) {
  return (
    <div className="move-list-wrap" data-component="move-list">
      <h2>{title}</h2>
      <ol className="move-list" aria-label={title}>
        {history.map((h, i) => (
          <li key={`${i}-${h.san}`} className={i === history.length - 1 ? 'current-move' : undefined}>
            <span>{Math.floor(i / 2) + 1}{i % 2 === 0 ? '.' : '...'}</span>
            <b>{h.san}</b>
          </li>
        ))}
      </ol>
    </div>
  );
}
