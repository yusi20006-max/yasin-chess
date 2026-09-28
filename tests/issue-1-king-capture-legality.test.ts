import {describe,expect,it} from 'vitest';
import {fromFEN} from '../src/core/board';
import {legalMoves} from '../src/core/moves';

describe('Issue #1 — king-capture legality', () => {
  it('never generates a move whose destination contains the opposing king', () => {
    const position = fromFEN('4k3/8/8/8/8/8/4R3/4K3 w - - 0 1');
    const moves = legalMoves(position);

    expect(moves).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ from: 12, to: 60 }),
      ]),
    );
    expect(
      moves.some((move) => position.board[move.to]?.type === 'k'),
    ).toBe(false);
  });

  it('rejects an adjacent-king capture path even when the position is constructed directly', () => {
    const position = fromFEN('4k3/8/8/8/8/8/4K3/8 w - - 0 1');
    position.board[12] = { color: 'w', type: 'k' };
    position.board[20] = { color: 'b', type: 'k' };

    const moves = legalMoves(position);
    expect(moves.some((move) => move.from === 12 && move.to === 20)).toBe(false);
    expect(moves.some((move) => position.board[move.to]?.type === 'k')).toBe(false);
  });
});
