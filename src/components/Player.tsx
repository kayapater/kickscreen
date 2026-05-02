import { useState } from "react";
import { getKickPlayerUrl } from "../lib/kickEmbed";

interface PlayerProps {
  streamer: string;
  onDelete: (streamer: string) => void;
}

export default function Player({ streamer, onDelete }: PlayerProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full h-full bg-black"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <iframe
        className="w-full h-full border-0"
        src={getKickPlayerUrl(streamer)}
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        title={`${streamer} yayını`}
      />
      {hovered && (
        <button
          onClick={() => onDelete(streamer)}
          className="absolute top-2 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-white text-sm font-bold transition-colors cursor-pointer"
          title={`${streamer} kaldır`}
        >
          ✕
        </button>
      )}
      {hovered && (
        <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded bg-black/70 text-white text-xs">
          {streamer}
        </div>
      )}
    </div>
  );
}
