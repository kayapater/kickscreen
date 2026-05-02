interface Env {}

interface KickChannelResponse {
  data: {
    account: {
      user: {
        username: string;
        profile_picture: string | null;
        is_verified: boolean;
      };
      channel: {
        slug: string;
      };
    };
  };
}

interface KickLivestreamResponse {
  data: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const slug = url.searchParams.get("slug")?.trim().toLowerCase();

  if (!slug || slug.length < 2) {
    return Response.json({ error: "Invalid slug" }, { status: 400, headers: corsHeaders() });
  }

  try {
    const channel = await fetchChannelInfo(slug);
    if (!channel) {
      return Response.json({ channel: null }, { headers: corsHeaders() });
    }
    return Response.json({ channel }, { headers: corsHeaders() });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500, headers: corsHeaders() });
  }
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: corsHeaders() });
};

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=300",
  };
}

async function fetchChannelInfo(slug: string) {
  const headers = {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  };

  try {
    const res = await fetch(
      `https://api.kick.com/private/v1/channels/${encodeURIComponent(slug)}`,
      { headers }
    );
    
    if (!res.ok) return null;

    const json = (await res.json()) as KickChannelResponse;
    if (!json.data?.account) return null;

    const { user, channel } = json.data.account;

    // Check if live
    let isLive = false;
    try {
      const liveRes = await fetch(
        `https://api.kick.com/private/v1/channels/${encodeURIComponent(channel.slug)}/livestream`,
        { headers }
      );
      if (liveRes.ok) {
        const liveJson = (await liveRes.json()) as KickLivestreamResponse;
        isLive = !!liveJson.data && Object.keys(liveJson.data).length > 0;
      }
    } catch (e) {
      console.error("Live status check failed:", e);
    }

    return {
      slug: channel.slug,
      username: user.username,
      profilePicture: user.profile_picture || null,
      isVerified: user.is_verified || false,
      isLive,
    };
  } catch (error) {
    console.error("Fetch channel info failed:", error);
    throw error;
  }
}
