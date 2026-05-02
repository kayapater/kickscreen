import { useState, useRef, useEffect } from "react";
import { getKickChatUrl } from "../lib/kickEmbed";
import { lookupChannel } from "../lib/kickApi";

const avatarCache = new Map<string, string | null>();

function useChannelAvatars(streamers: string[]) {
  const [avatars, setAvatars] = useState<Map<string, string | null>>(new Map());

  useEffect(() => {
    let cancelled = false;
    const toFetch = streamers.filter((s) => !avatarCache.has(s));

    if (toFetch.length === 0) {
      setAvatars(new Map(avatarCache));
      return;
    }

    Promise.all(
      toFetch.map(async (slug) => {
        try {
          const channel = await lookupChannel(slug);
          avatarCache.set(slug, channel?.profilePicture || null);
        } catch {
          avatarCache.set(slug, null);
        }
      })
    ).then(() => {
      if (!cancelled) setAvatars(new Map(avatarCache));
    });

    return () => { cancelled = true; };
  }, [streamers]);

  return avatars;
}

interface ChatroomProps {
  streamers: string[];
  chatroomStreamer: string;
  changeChatroomStreamer: (streamer: string) => void;
  toggleModalOpen: () => void;
  deleteStreamer: (streamer: string) => void;
  modChannels: string[];
  toggleModChannel: (streamer: string) => void;
}

function openModPanel(streamer: string) {
  const w = 1130;
  const h = 780;
  const left = window.screenX + Math.round((window.outerWidth - w) / 2);
  const top = window.screenY + Math.round((window.outerHeight - h) / 2);
  window.open(
    `https://dashboard.kick.com/moderator/${encodeURIComponent(streamer)}`,
    `kick-mod-${streamer}`,
    `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}

export default function Chatroom({
  streamers,
  chatroomStreamer,
  changeChatroomStreamer,
  toggleModalOpen,
  deleteStreamer,
  modChannels,
  toggleModChannel,
}: ChatroomProps) {
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; streamer: string } | null>(null);
  const ctxRef = useRef<HTMLDivElement>(null);
  const avatars = useChannelAvatars(streamers);

  useEffect(() => {
    if (!ctxMenu) return;
    const close = (e: MouseEvent) => {
      if (ctxRef.current && !ctxRef.current.contains(e.target as Node)) setCtxMenu(null);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [ctxMenu]);

  const isMod = modChannels.includes(chatroomStreamer);

  return (
    <div className="flex flex-col h-full bg-[#0e0e10]">
      <div className="flex items-center shrink-0">
        <div className="flex flex-wrap items-center gap-px flex-1 min-w-0">
          {streamers.map((streamer) => (
            <div
              key={streamer}
              className={`group flex items-center gap-1 h-9 px-2 cursor-pointer ${
                streamer === chatroomStreamer
                  ? "border-t-2 border-[#53fc18] bg-[#3f3f46]"
                  : "bg-[#374151] hover:bg-[#4b5563]"
              }`}
              onClick={() => changeChatroomStreamer(streamer)}
              onContextMenu={(e) => {
                e.preventDefault();
                setCtxMenu({ x: e.clientX, y: e.clientY, streamer });
              }}
            >
              {avatars.get(streamer) ? (
                <img
                  src={avatars.get(streamer)!}
                  alt={streamer}
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#53fc18]/20 flex items-center justify-center text-[#53fc18] text-[9px] font-bold shrink-0">
                  {streamer[0]?.toUpperCase()}
                </div>
              )}
              {modChannels.includes(streamer) && (
                <span className="text-[10px] text-[#53fc18]" title="Moderatör yetkisi aktif">⚔</span>
              )}
              <p className="translate-x-[13px] -translate-y-0.5 cursor-default group-hover:translate-x-0 text-sm font-semibold transition-transform truncate">
                {streamer}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteStreamer(streamer);
                }}
                className="opacity-0 group-hover:opacity-100 text-[#adadb8] hover:text-red-400 hover:bg-[#374151] rounded p-0.5 transition-opacity text-xs cursor-pointer"
                title={`${streamer} kaldır`}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            className="h-9 px-2 text-2xl hover:bg-[#4b5563] cursor-pointer"
            onClick={() => toggleModalOpen()}
          >
            +
          </button>
        </div>

        {isMod && (
          <button
            onClick={() => openModPanel(chatroomStreamer)}
            className="flex items-center gap-1 h-9 px-2.5 shrink-0 text-xs font-medium bg-[#374151] hover:bg-[#4b5563] text-[#53fc18] hover:text-white transition-colors cursor-pointer"
            title="Mod Paneli Aç"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
            Mod
          </button>
        )}
      </div>

      {ctxMenu && (
        <div
          ref={ctxRef}
          className="fixed z-50 bg-[#1f1f23] border border-[#2f2f35] rounded-lg shadow-xl py-1 min-w-[180px]"
          style={{ left: ctxMenu.x, top: ctxMenu.y }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-[#2f2f35] transition-colors cursor-pointer"
            onClick={() => {
              toggleModChannel(ctxMenu.streamer);
              setCtxMenu(null);
            }}
          >
            {modChannels.includes(ctxMenu.streamer)
              ? "✕ Moderatör yetkisini kaldır"
              : "⚔ Bu kanalda moderatörüm"}
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#2f2f35] transition-colors cursor-pointer"
            onClick={() => {
              deleteStreamer(ctxMenu.streamer);
              setCtxMenu(null);
            }}
          >
            ✕ Kanalı kaldır
          </button>
        </div>
      )}

      <div className="relative w-full h-full overflow-hidden">
        {chatroomStreamer && (
          <iframe
            className="w-full h-full"
            src={getKickChatUrl(chatroomStreamer)}
          />
        )}
      </div>
    </div>
  );
}
