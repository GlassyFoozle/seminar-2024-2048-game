type TileProps = {
  value: number | null;
};

export const Tile = ({ value }: TileProps) => {
  const classColor = `bg-tile-${value ?? 'null'}`;

  return (
    <div
      className={`flex items-center justify-center w-24 h-24 text-xl font-bold text-black rounded ${classColor}`}
    >
      {value}
    </div>
  );
};
