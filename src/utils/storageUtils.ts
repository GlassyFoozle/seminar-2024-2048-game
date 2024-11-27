import type { GameState, Map2048 } from '@/types';
import { addRandomTile } from '@/utils/boardUtils';

export const initializeGameState = (boardSize: number): GameState => {
  const storedGameState = localStorage.getItem('gameState');
  if (storedGameState != null) {
    return JSON.parse(storedGameState) as GameState;
  }

  const newBoard: Map2048 = Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => null),
  );

  return {
    board: addRandomTile(addRandomTile(newBoard)),
    status: 'playing',
  };
};
