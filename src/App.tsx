import React, { useCallback, useEffect, useState } from 'react';

import { type Map2048, moveMapIn2048Rule } from './Game'; // import base game logic

const BOARD_SIZE = 4;

const initializeBoard = (): Map2048 => {
  const newBoard: Map2048 = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null),
  );
  return addRandomTile(addRandomTile(newBoard));
};

const addRandomTile = (board: Map2048): Map2048 => {
  const emptyPositions = board.flatMap((row, i) =>
    row.flatMap((cell, j) => (cell === null ? [{ i, j }] : [])),
  );

  const randomEmptyPosition = emptyPositions.sort(() => Math.random() - 0.5)[0];

  if (randomEmptyPosition === undefined) {
    return board; // No empty tiles
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

const App: React.FC = () => {
  const [board, setBoard] = useState<Map2048>(initializeBoard);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    const storedBoard = localStorage.getItem('board');
    if (storedBoard != null) {
      setBoard(JSON.parse(storedBoard) as Map2048);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('board', JSON.stringify(board));
  }, [board]);

  const handleMove = useCallback(
    (direction: 'up' | 'left' | 'right' | 'down') => {
      const { result, isMoved } = moveMapIn2048Rule(board, direction);
      const checkGameOver = (newBoard: Map2048) => {
        if (!canMove(newBoard)) {
          setIsGameOver(true);
        }
      };

      if (isMoved) {
        const newBoard = addRandomTile(result);
        setBoard(newBoard);
        checkGameOver(newBoard);
      }
    },
    [board],
  );

  const canMove = (curBoard: Map2048): boolean => {
    // check for empty cells or possible merges
    return curBoard.some((row, rowIndex) =>
      row.some((cell, colIndex) => {
        if (cell === null) return true;
        if (
          colIndex < BOARD_SIZE - 1 && // check right
          row[colIndex + 1] === cell
        )
          return true;
        if (rowIndex < BOARD_SIZE - 1) {
          // check down
          const nextRow = curBoard[rowIndex + 1];
          if (nextRow === undefined) throw new Error('error while moving');
          if (nextRow[colIndex] === cell) return true;
        }
        return false;
      }),
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          handleMove('up');
          break;
        case 'ArrowDown':
          handleMove('down');
          break;
        case 'ArrowLeft':
          handleMove('left');
          break;
        case 'ArrowRight':
          handleMove('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMove, isGameOver]);

  const resetGame = () => {
    setBoard(initializeBoard());
    setIsGameOver(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>2048 Game</h1>
      {isGameOver && <div>Game Over!</div>}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 100px)`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: cell != null ? '#eee' : '#ccc',
                margin: '5px',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {cell}
            </div>
          )),
        )}
      </div>
      <button onClick={resetGame} style={{ marginTop: '20px' }}>
        Restart Game
      </button>
    </div>
  );
};

export default App;
