import Player from "./Player";

interface PlayersProps {
  streamers: string[];
  onDeleteStreamer: (streamer: string) => void;
}

function getGridLayout(count: number): { cols: number; rows: number } {
  if (count <= 0) return { cols: 1, rows: 1 };
  if (count === 1) return { cols: 1, rows: 1 };
  if (count === 2) return { cols: 2, rows: 1 };
  if (count <= 4) return { cols: 2, rows: 2 };
  if (count <= 6) return { cols: 3, rows: 2 };
  if (count <= 9) return { cols: 3, rows: 3 };
  if (count <= 12) return { cols: 4, rows: 3 };
  return { cols: 4, rows: 4 };
}

export default function Players({ streamers, onDeleteStreamer }: PlayersProps) {
  const { cols, rows } = getGridLayout(streamers.length);

  if (streamers.length === 0) {
    return null;
  }

  return (
    <div
      className="w-full h-full grid gap-0.5 bg-[#18181b]"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {streamers.map((streamer) => (
        <Player
          key={streamer}
          streamer={streamer}
          onDelete={onDeleteStreamer}
        />
      ))}
    </div>
  );
}
