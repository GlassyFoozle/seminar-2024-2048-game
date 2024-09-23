import './App.css';

import { useCallback, useEffect, useState } from 'react';

import { type Map2048, moveMapIn2048Rule } from './Game'; // import base game logic

const BOARD_SIZE = 4;

const initializeBoard = (): Map2048 => {
  const storedBoard = localStorage.getItem('board');
  if (storedBoard != null) {
    return JSON.parse(storedBoard) as Map2048;
  } else {
    const newBoard: Map2048 = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null),
    );
    return addRandomTile(addRandomTile(newBoard));
  }
};

const initializeGameOver = (): boolean => {
  const storedGameOver = localStorage.getItem('isGameOver');
  if (storedGameOver != null) {
    return JSON.parse(storedGameOver) as boolean;
  } else {
    return false;
  }
};

const initializeHasWon = (): boolean => {
  const storedHasWon = localStorage.getItem('hasWon');
  if (storedHasWon != null) {
    return JSON.parse(storedHasWon) as boolean;
  } else {
    return false;
  }
}; // 너무 노가다로 해결한 것 같습니다..

const addRandomTile = (board: Map2048): Map2048 => {
  const emptyPositions = board.flatMap((row, i) =>
    row.flatMap((cell, j) => (cell === null ? [{ i, j }] : [])),
  );

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

function App() {
  // main app
  const [board, setBoard] = useState<Map2048>(initializeBoard);
  const [isGameOver, setIsGameOver] = useState(initializeGameOver);
  const [hasWon, setHasWon] = useState(initializeHasWon);

  useEffect(() => {
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('isGameOver', JSON.stringify(isGameOver));
    localStorage.setItem('hasWon', JSON.stringify(hasWon));
  }, [board, isGameOver, hasWon]);

  const handleMove = useCallback(
    (direction: 'up' | 'left' | 'right' | 'down') => {
      if (hasWon || isGameOver) return;

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
        checkWinCondition(newBoard);
      }
    },
    [board, hasWon, isGameOver],
  );

  const checkWinCondition = (newBoard: Map2048) => {
    // check win
    if (newBoard.some((row) => row.some((cell) => cell === 128))) {
      setHasWon(true); // win if some tile reaches 128
    }
  };

  const canMove = (curBoard: Map2048): boolean => {
    // check if board is movable
    // check for empty cells or possible merges
    return curBoard.some((row, rowIndex) =>
      row.some((cell, colIndex) => {
        if (cell === null) return true;
        if (
          colIndex < BOARD_SIZE - 1 &&
          row[colIndex + 1] === cell // check left-right
        )
          return true;
        if (rowIndex < BOARD_SIZE - 1) {
          // check up-down
          const nextRow = curBoard[rowIndex + 1];
          if (nextRow === undefined) throw new Error('error');
          if (nextRow[colIndex] === cell) return true;
        }
        return false;
      }),
    );
  };

  useEffect(() => {
    // handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || hasWon) return;

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
  }, [handleMove, isGameOver, hasWon]);

  const resetGame = () => {
    localStorage.clear();
    setBoard(initializeBoard());
    setIsGameOver(false);
    setHasWon(false);
  };

  const getTileClass = (value: number | null): string => {
    if (value === null) return 'tile-null';
    return `tile-${value}`;
  };

  return (
    <div className="game-container">
      <h1>(not)2048 Game</h1>
      {hasWon && <div className="message">You win!</div>}
      {isGameOver && <div className="message">Game Over!</div>}
      <div
        className={`game-board ${hasWon || isGameOver ? 'opaque' : ''}`}
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 100px)` }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`tile ${getTileClass(cell)}`}
            >
              {cell}
            </div>
          )),
        )}
      </div>
      <button onClick={resetGame}>Restart Game</button>
    </div>
  );
}

export default App;
