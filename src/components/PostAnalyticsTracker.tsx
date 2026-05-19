"use client";

import { useEffect } from "react";

type PostAnalyticsTrackerProps = {
  slug: string;
};

// Client-side cooldown matching the server-side rate-limit window (60 s).
// Stored at module level so React strict mode's unmount/remount cycle (which
// happens within milliseconds) is treated as within the cooldown and skipped,
// while a genuine user navigation back to the same post after the window
// expires will still be tracked.
const TRACK_COOLDOWN_MS = 60_000;
const lastTrackedAt = new Map<string, number>();

export default function PostAnalyticsTracker({ slug }: PostAnalyticsTrackerProps) {
  useEffect(() => {
    const now = Date.now();
    const prev = lastTrackedAt.get(slug);

    // Skip if within the cooldown window (handles React strict-mode double-mount
    // and genuine rapid revisits that the server would rate-limit anyway).
    if (prev !== undefined && now - prev < TRACK_COOLDOWN_MS) {
      return;
    }

    // Record the timestamp before the async call.  This is intentional: claiming
    // the slot before the fetch is in-flight prevents a second concurrent render
    // from also passing the cooldown check while the first fetch is pending.
    // On a network failure the server also did not increment, so missing the
    // retry window is acceptable — the next page-load or post-cooldown visit
    // will trigger fresh tracking.
    lastTrackedAt.set(slug, now);

    void fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ slug }),
      cache: "no-store",
    }).catch(() => {
      // Ignore telemetry failures.
    });
  }, [slug]);

  return null;
}
