"use client";

import { useEffect } from "react";

type PostAnalyticsTrackerProps = {
  slug: string;
};

export default function PostAnalyticsTracker({ slug }: PostAnalyticsTrackerProps) {
  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ slug }),
      cache: "no-store",
      keepalive: true,
      signal: controller.signal,
    }).catch(() => {
      // Ignore telemetry failures.
    });

    return () => {
      controller.abort();
    };
  }, [slug]);

  return null;
}
