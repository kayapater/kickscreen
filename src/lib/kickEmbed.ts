export const getKickPlayerUrl = (streamer: string): string =>
  `https://player.kick.cx/${encodeURIComponent(streamer)}`;

export const getKickChatUrl = (streamer: string): string =>
  `https://chat.kick.cx/embed/${encodeURIComponent(streamer)}`;
