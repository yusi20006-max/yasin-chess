import type {Piece as PieceType} from '../core/types';
import {pieceAriaLabel, type PieceSetId} from './pieceSet';
import './piece-3d.css';

type PieceProps = {
  piece: PieceType;
  set?: PieceSetId;
  animated?: boolean;
};

const common = {
  viewBox: '0 0 100 100',
  focusable: false,
  'aria-hidden': true,
};

function PieceShape({type}: {type: PieceType['type']}) {
  switch (type) {
    case 'k':
      return <><path d="M46 12h8v10h10v8H54v7h14l7 12v28H25V49l7-12h14v-7H32v-8h14V12z" /><path d="M21 77h58v10H21z" /></>;
    case 'q':
      return <><path d="M20 28l12 9 18-20 18 20 12-9-8 48H28z" /><path d="M24 78h52v10H24z" /><circle cx="20" cy="25" r="5"/><circle cx="80" cy="25" r="5"/><circle cx="50" cy="14" r="5"/></>;
    case 'r':
      return <><path d="M27 20h10v8h8v-8h10v8h8v-8h10v17l-8 9v27h8v7H27v-7h8V46l-8-9z" /><path d="M22 80h56v9H22z" /></>;
    case 'b':
      return <><path d="M50 14c-13 0-21 11-17 22 2 6 7 10 7 16l-13 28h46L60 52c0-6 5-10 7-16 4-11-4-22-17-22z" /><path d="M23 80h54v9H23zM44 31l12 12" stroke="currentColor" stroke-width="6" fill="none"/></>;
    case 'n':
      return <><path d="M27 86c5-12 5-20 2-28-3-8-1-19 6-27 7-8 15-11 23-16l10 9-8 9c10 8 13 19 10 31-2 8-8 14-15 22z" /><path d="M31 86h43v5H31z" /><circle cx="55" cy="34" r="3" fill="currentColor"/></>;
    case 'p':
      return <><circle cx="50" cy="28" r="13" /><path d="M39 40h22c-1 10 3 14 10 22l6 17H23l6-17c7-8 11-12 10-22z" /><path d="M22 79h56v10H22z" /></>;
  }
}

export default function Piece({piece, set = 'unicode', animated = true}: PieceProps) {
  void set;
  const gradientId = `piece-gradient-${piece.color}-${piece.type}`;
  const shadowId = `piece-shadow-${piece.color}-${piece.type}`;
  const isWhite = piece.color === 'w';

  return (
    <span
      className={`piece piece-${piece.color}${animated ? ' piece-animated' : ''}`}
      role="img"
      aria-label={pieceAriaLabel(piece)}
      data-piece={piece.color + piece.type}
      data-piece-style="modern-3d"
    >
      <svg className="piece-svg" {...common}>
        <defs>
          <linearGradient id={gradientId} x1="18%" y1="8%" x2="82%" y2="92%">
            {isWhite ? (
              <>
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="38%" stopColor="#dbeafe" />
                <stop offset="72%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#64748b" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#475569" />
                <stop offset="34%" stopColor="#1e293b" />
                <stop offset="72%" stopColor="#111827" />
                <stop offset="100%" stopColor="#020617" />
              </>
            )}
          </linearGradient>
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="2.5"
              floodColor={isWhite ? '#0f172a' : '#000000'}
              floodOpacity={isWhite ? '0.42' : '0.62'}
            />
          </filter>
        </defs>
        <g
          fill={`url(#${gradientId})`}
          stroke={isWhite ? '#e2e8f0' : '#64748b'}
          strokeWidth="2.6"
          strokeLinejoin="round"
          filter={`url(#${shadowId})`}
        >
          <PieceShape type={piece.type} />
        </g>
        <path
          className="piece-highlight"
          d="M31 27c6-8 12-11 19-12"
          fill="none"
          stroke={isWhite ? '#ffffff' : '#cbd5e1'}
          strokeWidth="3"
          strokeLinecap="round"
          opacity=".62"
        />
      </svg>
    </span>
  );
}
