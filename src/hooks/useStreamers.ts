import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kick-streamers";
const STORAGE_CHAT_KEY = "kick-chat-streamer";
const STORAGE_MOD_KEY = "kick-mod-channels";

function getSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

function updateUrl(streamers: string[], chat: string) {
  const params = new URLSearchParams();
  streamers.forEach((s) => params.append("s", s));
  if (chat) params.set("chat", chat);
  const qs = params.toString();
  const newUrl = qs
    ? `${window.location.pathname}?${qs}`
    : window.location.pathname;
  window.history.replaceState(null, "", newUrl);
}

function loadFromStorage(): { streamers: string[]; chat: string } {
  try {
    const streamers = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ) as string[];
    const chat = localStorage.getItem(STORAGE_CHAT_KEY) || "";
    return { streamers, chat };
  } catch {
    return { streamers: [], chat: "" };
  }
}

function saveToStorage(streamers: string[], chat: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(streamers));
  localStorage.setItem(STORAGE_CHAT_KEY, chat);
}

function initState(): { streamers: string[]; chatroomStreamer: string } {
  const params = getSearchParams();
  const urlStreamers = params.getAll("s").filter(Boolean);
  const urlChat = params.get("chat") || "";

  if (urlStreamers.length > 0) {
    const chat = urlChat && urlStreamers.includes(urlChat) ? urlChat : urlStreamers[0];
    saveToStorage(urlStreamers, chat);
    return { streamers: urlStreamers, chatroomStreamer: chat };
  }

  const stored = loadFromStorage();
  if (stored.streamers.length > 0) {
    const chat =
      stored.chat && stored.streamers.includes(stored.chat)
        ? stored.chat
        : stored.streamers[0];
    return { streamers: stored.streamers, chatroomStreamer: chat };
  }

  return { streamers: [], chatroomStreamer: "" };
}

export function useStreamers() {
  const [streamers, setStreamers] = useState<string[]>([]);
  const [chatroomStreamer, setChatroomStreamer] = useState<string>("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const state = initState();
    setStreamers(state.streamers);
    setChatroomStreamer(state.chatroomStreamer);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    updateUrl(streamers, chatroomStreamer);
    saveToStorage(streamers, chatroomStreamer);
  }, [streamers, chatroomStreamer, initialized]);

  const addStreamer = useCallback((name: string) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized) return;
    setStreamers((prev) => {
      if (prev.includes(normalized)) return prev;
      return [...prev, normalized];
    });
    setChatroomStreamer((prev) => prev || normalized);
  }, []);

  const deleteStreamer = useCallback(
    (name: string) => {
      setStreamers((prev) => {
        const next = prev.filter((s) => s !== name);
        setChatroomStreamer((chat) => {
          if (chat === name) return next[0] || "";
          return chat;
        });
        return next;
      });
    },
    []
  );

  const changeChatroomStreamer = useCallback((name: string) => {
    setChatroomStreamer(name);
  }, []);

  const [modChannels, setModChannels] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_MOD_KEY) || "[]") as string[];
    } catch {
      return [];
    }
  });

  const toggleModChannel = useCallback((name: string) => {
    setModChannels((prev) => {
      const next = prev.includes(name)
        ? prev.filter((s) => s !== name)
        : [...prev, name];
      localStorage.setItem(STORAGE_MOD_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    streamers,
    chatroomStreamer,
    addStreamer,
    deleteStreamer,
    changeChatroomStreamer,
    modChannels,
    toggleModChannel,
  };
}
