import { Tile } from '@/components/Tile';
import { type Map2048 } from '@/types';

type BoardProps = {
  board: Map2048;
};

export const Board = ({ board }: BoardProps) => {
  return (
    <div
      className="grid gap-2 p-4 bg-gray-800 rounded-lg"
      style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
    >
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={value} />
        )),
      )}
    </div>
  );
};
