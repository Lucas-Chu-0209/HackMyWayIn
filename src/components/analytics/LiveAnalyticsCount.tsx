"use client";

import { useEffect, useState } from "react";

type AnalyticsTrackedDetail = {
  slug: string;
  postViews: number | null;
  totalViews: number | null;
  totalVisitors: number | null;
};

type LiveAnalyticsCountProps = {
  metric: "postViews" | "totalViews" | "totalVisitors";
  initialValue: number;
  slug?: string;
};

function isAnalyticsTrackedDetail(value: unknown): value is AnalyticsTrackedDetail {
  if (!value || typeof value !== "object") {
    return false;
  }

  const detail = value as Partial<AnalyticsTrackedDetail>;

  return (
    typeof detail.slug === "string"
    && (typeof detail.postViews === "number" || detail.postViews === null)
    && (typeof detail.totalViews === "number" || detail.totalViews === null)
    && (typeof detail.totalVisitors === "number" || detail.totalVisitors === null)
  );
}

export default function LiveAnalyticsCount({ metric, initialValue, slug }: LiveAnalyticsCountProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    function handleAnalyticsTracked(event: Event) {
      if (!(event instanceof CustomEvent) || !isAnalyticsTrackedDetail(event.detail)) {
        return;
      }

      if (metric === "postViews") {
        if (!slug || event.detail.slug !== slug || event.detail.postViews === null) {
          return;
        }

        setValue(event.detail.postViews);
        return;
      }

      if (metric === "totalViews" && event.detail.totalViews !== null) {
        setValue(event.detail.totalViews);
        return;
      }

      if (metric === "totalVisitors" && event.detail.totalVisitors !== null) {
        setValue(event.detail.totalVisitors);
      }
    }

    window.addEventListener("analytics:tracked", handleAnalyticsTracked);
    return () => {
      window.removeEventListener("analytics:tracked", handleAnalyticsTracked);
    };
  }, [metric, slug]);

  return <>{value.toLocaleString()}</>;
}
