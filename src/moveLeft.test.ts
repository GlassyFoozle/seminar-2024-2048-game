import { describe, expect, it } from 'vitest';

import { moveLeft } from '@/Game';
import { type Map2048 } from '@/types';

describe('moveLeft', () => {
  it('should merge blocks if possible', () => {
    const board: Map2048 = [
      [2, null, 2, null],
      [2, 2, 2, 2],
      [4, 4, 4, 4],
      [8, 8, 16, 16],
    ];
    const expectedBoard: Map2048 = [
      [4, null, null, null],
      [4, 4, null, null],
      [8, 8, null, null],
      [16, 32, null, null],
    ];
    const { result: newBoard, isMoved } = moveLeft(board);
    expect(newBoard).toStrictEqual(expectedBoard);
    expect(isMoved).toBe(true);
  });

  it('should move blocks if possible', () => {
    const board: Map2048 = [
      [2, null, 4, null],
      [null, 8, null, 16],
      [32, null, null, 2],
      [null, null, null, 64],
    ];
    const expectedBoard: Map2048 = [
      [2, 4, null, null],
      [8, 16, null, null],
      [32, 2, null, null],
      [64, null, null, null],
    ];
    const { result: newBoard, isMoved } = moveLeft(board);
    expect(newBoard).toStrictEqual(expectedBoard);
    expect(isMoved).toBe(true);
  });

  it('should not move any blocks if it is not possible', () => {
    const board: Map2048 = [
      [2, 4, 2, null],
      [4, 8, 32, 16],
      [32, 64, 4, 2],
      [32, 16, 8, 4],
    ];
    const expectedBoard: Map2048 = [
      [2, 4, 2, null],
      [4, 8, 32, 16],
      [32, 64, 4, 2],
      [32, 16, 8, 4],
    ];
    const { result: newBoard, isMoved } = moveLeft(board);
    expect(newBoard).toStrictEqual(expectedBoard);
    expect(isMoved).toBe(false);
  });
});
