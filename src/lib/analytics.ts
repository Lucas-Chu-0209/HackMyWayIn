import { createHash } from "node:crypto";

import { kv } from "@vercel/kv";

const IS_DEV = process.env.NODE_ENV !== "production";
const warnedMessages = new Set<string>();

const ANALYTICS_KEYS = {
  totalViews: "views:total",
  totalVisitorsSet: "visitors:total:set",
  totalVisitors: "visitors:total",
  postViews: (slug: string) => `views:post:${slug}`,
} as const;

type HeaderSource = {
  get(name: string): string | null;
};

export type SiteAnalyticsTotals = {
  totalViews: number;
  totalVisitors: number;
};

function warnOnce(message: string) {
  if (!warnedMessages.has(message)) {
    warnedMessages.add(message);
    console.warn(message);
  }
}

function isKvConfigured() {
  const configured = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  if (!configured && IS_DEV) {
    warnOnce("[analytics] KV is not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN to enable analytics counters.");
  }

  return configured;
}

function getVisitorSalt() {
  const configuredSalt = process.env.VISITOR_SALT?.trim();

  if (configuredSalt) {
    return configuredSalt;
  }

  if (IS_DEV) {
    warnOnce("[analytics] VISITOR_SALT is not configured. Falling back to a local development salt.");
    return "dev-visitor-salt";
  }

  warnOnce("[analytics] VISITOR_SALT is not configured. Unique visitor tracking is disabled.");
  return null;
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

function getVisitorHash(headers: HeaderSource, visitorSalt: string) {
  const ip = getClientIp(headers);
  const userAgent = headers.get("user-agent") ?? "unknown-ua";

  return sha256(`${visitorSalt}:${ip}:${userAgent}`);
}

export async function getPostViews(slug: string) {
  if (!isKvConfigured()) {
    return 0;
  }

  try {
    const value = await kv.get<number | string>(ANALYTICS_KEYS.postViews(slug));
    return toPositiveInteger(value);
  } catch (error) {
    if (IS_DEV) {
      console.error("[analytics] Failed to read post views from KV.", error);
    }
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
  } catch (error) {
    if (IS_DEV) {
      console.error("[analytics] Failed to read site analytics totals from KV.", error);
    }

    return {
      totalViews: 0,
      totalVisitors: 0,
    };
  }
}

export async function trackPostAnalytics(slug: string, headers: HeaderSource) {
  if (!isKvConfigured()) {
    return {
      tracked: false,
      rateLimited: false,
      reason: "kv_not_configured" as const,
    };
  }

  try {
    await Promise.all([
      kv.incr(ANALYTICS_KEYS.postViews(slug)),
      kv.incr(ANALYTICS_KEYS.totalViews),
    ]);
  } catch (error) {
    if (IS_DEV) {
      console.error("[analytics] Failed to increment page view counters.", error);
    }

    return {
      tracked: false,
      rateLimited: false,
      reason: "kv_write_failed" as const,
    };
  }

  const visitorSalt = getVisitorSalt();

  if (!visitorSalt) {
    return {
      tracked: true,
      rateLimited: false,
      reason: "visitor_salt_missing" as const,
    };
  }

  const visitorHash = getVisitorHash(headers, visitorSalt);

  try {
    const addedToUniqueSet = await kv.sadd(ANALYTICS_KEYS.totalVisitorsSet, visitorHash);

    if (addedToUniqueSet > 0) {
      await kv.incr(ANALYTICS_KEYS.totalVisitors);
    }
  } catch (error) {
    if (IS_DEV) {
      console.error("[analytics] Failed to update unique visitor counters.", error);
    }
  }

  return {
    tracked: true,
    rateLimited: false,
  };
}
