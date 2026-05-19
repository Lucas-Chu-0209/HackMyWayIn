"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type PostAnalyticsTrackerProps = {
  slug: string;
};

export default function PostAnalyticsTracker({ slug }: PostAnalyticsTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== `/posts/${slug}`) {
      return;
    }

    let isActive = true;

    void (async () => {
      try {
        const response = await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ slug }),
          cache: "no-store",
          keepalive: true,
        });

        if (!response.ok || !isActive) {
          return;
        }

        const payload = (await response.json()) as {
          tracked?: boolean;
          slug?: unknown;
          postViews?: unknown;
          totalViews?: unknown;
          totalVisitors?: unknown;
        };

        if (
          payload.tracked
          && typeof payload.slug === "string"
          && (typeof payload.postViews === "number" || payload.postViews === null)
          && (typeof payload.totalViews === "number" || payload.totalViews === null)
          && (typeof payload.totalVisitors === "number" || payload.totalVisitors === null)
        ) {
          window.dispatchEvent(new CustomEvent("analytics:tracked", {
            detail: {
              slug: payload.slug,
              postViews: payload.postViews,
              totalViews: payload.totalViews,
              totalVisitors: payload.totalVisitors,
            },
          }));
        }
      } catch {
        // Ignore telemetry failures.
      }
    })();

    return () => {
      isActive = false;
    };
  }, [slug, pathname]);

  return null;
}
