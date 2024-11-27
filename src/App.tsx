import { useCallback, useEffect, useState } from 'react';

import { Board } from '@/components/Board';
import { moveMapIn2048Rule } from '@/Game'; // import base game logic
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { addRandomTile, getGameStatus } from '@/utils/boardUtils';
import { initializeGameState } from '@/utils/storageUtils';

import { type GameState } from './types';

const BOARD_SIZE = 4;

function App() {
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGameState(BOARD_SIZE),
  );

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  const handleMove = useCallback(
    (direction: 'up' | 'left' | 'right' | 'down') => {
      if (gameState.status !== 'playing') return;

      const { result, isMoved } = moveMapIn2048Rule(gameState.board, direction);

      if (isMoved) {
        const newBoard = addRandomTile(result);
        const newStatus = getGameStatus(newBoard);
        setGameState({
          board: newBoard,
          status: newStatus,
        });
      }
    },
    [gameState],
  );

  useKeyboardInput(handleMove, gameState.status !== 'playing');

  const resetGame = () => {
    localStorage.clear();
    setGameState(initializeGameState(BOARD_SIZE));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">(not)2048 Game</h1>
      {gameState.status === 'won' && (
        <div className="absolute z-10 p-4 text-3xl text-white bg-black/75 rounded">
          You win!
        </div>
      )}
      {gameState.status === 'lost' && (
        <div className="absolute z-10 p-4 text-3xl text-white bg-black/75 rounded">
          Game Over!
        </div>
      )}
      <div
        className={
          gameState.status !== 'playing' ? 'opacity-50 pointer-events-none' : ''
        }
      >
        <Board board={gameState.board} />
      </div>
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 text-white bg-green rounded hover:bg-darkgreen"
      >
        Restart Game
      </button>
    </div>
  );
}

export default App;
