"use client";

import { useEffect } from "react";

type PostAnalyticsTrackerProps = {
  slug: string;
};

// Module-level guard so React strict mode's double-mount in dev does not
// send the tracking request twice for the same slug within a single page load.
const trackedThisPageLoad = new Set<string>();

export default function PostAnalyticsTracker({ slug }: PostAnalyticsTrackerProps) {
  useEffect(() => {
    // Skip if already tracked this slug in the current JS module lifetime.
    if (trackedThisPageLoad.has(slug)) return;
    trackedThisPageLoad.add(slug);

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
