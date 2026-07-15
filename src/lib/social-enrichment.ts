import { Agent, setGlobalDispatcher } from "undici";

// Outbound connections in some hosting/dev environments are slow to
// establish; undici's default 10s connect timeout can clip them.
setGlobalDispatcher(new Agent({ connect: { timeout: 30_000 } }));

export interface EnrichedMedia {
  title: string;
  thumbnailUrl?: string;
  viewCount?: number;
  publishedAt?: string;
  authorName?: string;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const match = parsed.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
      if (match) return match[2];
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchYouTubeEnrichment(url: string): Promise<EnrichedMedia | null> {
  const videoId = extractYouTubeId(url);
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!videoId || !apiKey) return null;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${apiKey}`,
    { next: { revalidate: 3600 } },
  );
  if (!res.ok) return null;

  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;

  return {
    title: item.snippet.title,
    thumbnailUrl:
      item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url,
    viewCount: item.statistics?.viewCount ? Number(item.statistics.viewCount) : undefined,
    publishedAt: item.snippet.publishedAt,
    authorName: item.snippet.channelTitle,
  };
}

function extractTwitchClipSlug(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("clips.twitch.tv")) {
      return parsed.pathname.slice(1) || parsed.searchParams.get("clip");
    }
    if (parsed.hostname.includes("twitch.tv")) {
      const match = parsed.pathname.match(/\/clip\/([^/?]+)/);
      if (match) return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

let twitchTokenCache: { token: string; expiresAt: number } | null = null;

async function getTwitchAppToken(): Promise<string | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (twitchTokenCache && twitchTokenCache.expiresAt > Date.now()) {
    return twitchTokenCache.token;
  }

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) return null;

  const data = await res.json();
  twitchTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return twitchTokenCache.token;
}

async function fetchTwitchEnrichment(url: string): Promise<EnrichedMedia | null> {
  const slug = extractTwitchClipSlug(url);
  const clientId = process.env.TWITCH_CLIENT_ID;
  if (!slug || !clientId) return null;

  const token = await getTwitchAppToken();
  if (!token) return null;

  const res = await fetch(`https://api.twitch.tv/helix/clips?id=${slug}`, {
    headers: { "Client-Id": clientId, Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const data = await res.json();
  const clip = data.data?.[0];
  if (!clip) return null;

  return {
    title: clip.title,
    thumbnailUrl: clip.thumbnail_url,
    viewCount: clip.view_count,
    publishedAt: clip.created_at,
    authorName: clip.broadcaster_name,
  };
}

async function fetchTikTokEnrichment(url: string): Promise<EnrichedMedia | null> {
  // TikTok's oEmbed endpoint is public and needs no API key or auth.
  const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.title) return null;

  return {
    title: data.title,
    thumbnailUrl: data.thumbnail_url,
    authorName: data.author_name,
  };
}

export async function fetchEnrichment(
  platform: string | undefined,
  url: string | undefined,
): Promise<EnrichedMedia | null> {
  if (!url) return null;
  if (platform === "YouTube") return fetchYouTubeEnrichment(url);
  if (platform === "Twitch") return fetchTwitchEnrichment(url);
  if (platform === "TikTok") return fetchTikTokEnrichment(url);
  return null;
}
