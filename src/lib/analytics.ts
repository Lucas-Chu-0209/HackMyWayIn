import { createHash } from "node:crypto";

import { kv } from "@vercel/kv";

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;
const VISITOR_SALT = process.env.VISITOR_SALT ?? "";

const ANALYTICS_KEYS = {
  totalViews: "views:total",
  totalVisitorsSet: "visitors:total:set",
  totalVisitors: "visitors:total",
  postViews: (slug: string) => `views:post:${slug}`,
  rateLimit: (slug: string, bucket: string) => `ratelimit:track:${slug}:${bucket}`,
} as const;

const TRACK_WINDOW_SECONDS = 60;

type HeaderSource = {
  get(name: string): string | null;
};

export type SiteAnalyticsTotals = {
  totalViews: number;
  totalVisitors: number;
};

function isKvConfigured() {
  return Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function toPositiveInteger(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  return 0;
}

function getClientIp(headers: HeaderSource) {
  const xForwardedFor = headers.get("x-forwarded-for");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown-ip";
  }

  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? "unknown-ip";
}

function getVisitorHash(headers: HeaderSource) {
  const ip = getClientIp(headers);
  const userAgent = headers.get("user-agent") ?? "unknown-ua";

  return sha256(`${VISITOR_SALT}:${ip}:${userAgent}`);
}

function getRateLimitBucket(headers: HeaderSource, slug: string) {
  const ip = getClientIp(headers);
  return sha256(`${VISITOR_SALT}:${slug}:${ip}`);
}

export async function getPostViews(slug: string) {
  if (!isKvConfigured()) {
    return 0;
  }

  try {
    const value = await kv.get<number | string>(ANALYTICS_KEYS.postViews(slug));
    return toPositiveInteger(value);
  } catch {
    return 0;
  }
}

export async function getSiteAnalyticsTotals(): Promise<SiteAnalyticsTotals> {
  if (!isKvConfigured()) {
    return {
      totalViews: 0,
      totalVisitors: 0,
    };
  }

  try {
    const [totalViews, totalVisitors] = await Promise.all([
      kv.get<number | string>(ANALYTICS_KEYS.totalViews),
      kv.get<number | string>(ANALYTICS_KEYS.totalVisitors),
    ]);

    return {
      totalViews: toPositiveInteger(totalViews),
      totalVisitors: toPositiveInteger(totalVisitors),
    };
  } catch {
    return {
      totalViews: 0,
      totalVisitors: 0,
    };
  }
}

async function acquireTrackRateLimit(slug: string, headers: HeaderSource) {
  const bucket = getRateLimitBucket(headers, slug);
  const key = ANALYTICS_KEYS.rateLimit(slug, bucket);

  try {
    const result = await kv.set(key, "1", {
      ex: TRACK_WINDOW_SECONDS,
      nx: true,
    });

    return result === "OK";
  } catch {
    return true;
  }
}

export async function trackPostAnalytics(slug: string, headers: HeaderSource) {
  if (!isKvConfigured()) {
    return {
      tracked: false,
      rateLimited: false,
    };
  }

  const canTrack = await acquireTrackRateLimit(slug, headers);

  if (!canTrack) {
    return {
      tracked: false,
      rateLimited: true,
    };
  }

  const visitorHash = getVisitorHash(headers);

  await Promise.all([
    kv.incr(ANALYTICS_KEYS.postViews(slug)),
    kv.incr(ANALYTICS_KEYS.totalViews),
  ]);

  const addedToUniqueSet = await kv.sadd(ANALYTICS_KEYS.totalVisitorsSet, visitorHash);

  if (addedToUniqueSet > 0) {
    await kv.incr(ANALYTICS_KEYS.totalVisitors);
  }

  return {
    tracked: true,
    rateLimited: false,
  };
}
