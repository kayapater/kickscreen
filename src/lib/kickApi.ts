export interface KickChannel {
  slug: string;
  username: string;
  profilePicture: string | null;
  isVerified: boolean;
  isLive: boolean;
}

/**
 * Extract Kick channel slug from user input.
 * Handles: "xqc", "kick.com/xqc", "https://kick.com/xqc", "www.kick.com/xqc"
 */
export function extractSlug(input: string): string {
  let s = input.trim();

  // Strip URL prefix patterns
  s = s.replace(/^https?:\/\//, "");
  s = s.replace(/^(?:www\.)?kick\.com\//, "");

  // Remove trailing slashes and query strings
  s = s.split("?")[0].split("#")[0].replace(/\/+$/, "");

  // Take only the first path segment (in case of /channel/something)
  s = s.split("/")[0];

  return s.toLowerCase();
}

/**
 * Look up a Kick channel via our Cloudflare Function proxy.
 */
export async function lookupChannel(
  slug: string,
  signal?: AbortSignal
): Promise<KickChannel | null> {
  try {
    const res = await fetch(`/api/channel?slug=${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      signal,
    });
    if (!res.ok) return null;

    const json = await res.json();
    return json.channel || null;
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    console.error("Lookup failed:", error);
    return null;
  }
}
