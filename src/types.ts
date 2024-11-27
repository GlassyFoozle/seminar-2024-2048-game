type Cell = number | null;
type Map2048 = Cell[][];
type Direction = 'up' | 'left' | 'right' | 'down';
type RotateDegree = 0 | 90 | 180 | 270;
type DirectionDegreeMap = Record<Direction, RotateDegree>;
type MoveResult = { result: Map2048; isMoved: boolean };

export type { Map2048, DirectionDegreeMap, MoveResult }