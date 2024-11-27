import type { GameStatus, Map2048 } from '@/types';

export const addRandomTile = (board: Map2048): Map2048 => {
  const emptyPositions = board.flatMap((row, i) =>
    row.flatMap((cell, j) => (cell === null ? { i, j } : [])),
  );

  if (emptyPositions.length === 0) return board;

  const randomEmptyPosition = emptyPositions.sort(() => Math.random() - 0.5)[0];

  if (randomEmptyPosition === undefined) {
    return board; // if no empty tiles
  } else {
    const randomValue = Math.random() < 0.9 ? 2 : 4;
    const newBoard = board.map((row, i) =>
      row.map((cell, j) =>
        i === randomEmptyPosition.i && j === randomEmptyPosition.j
          ? randomValue
          : cell,
      ),
    );
    return newBoard;
  }
};

const canMove = (board: Map2048): boolean => {
  return board.some((row, i) =>
    row.some((cell, j) => {
      if (cell === null) return true;
      const nextRight = row[j + 1];
      const nextDown = board[i + 1]?.[j];
      return cell === nextRight || cell === nextDown;
    }),
  );
};

export const getGameStatus = (board: Map2048): GameStatus => {
  if (board.flat().includes(128)) return 'won';
  if (!canMove(board)) return 'lost';
  return 'playing';
};
