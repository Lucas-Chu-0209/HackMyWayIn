"use client";

import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

type MermaidRendererProps = {
  chart: string;
};

export default function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const id = useId().replace(/:/g, "");
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !chart || !containerRef.current) {
      return;
    }

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default",
      themeVariables: {
        primaryColor: "#dbeafe",
        primaryTextColor: "#0f172a",
        primaryBorderColor: "#3b82f6",
        lineColor: "#475569",
        secondaryColor: "#ecfeff",
        tertiaryColor: "#f8fafc",
      },
    });

    const renderChart = async () => {
      try {
        setError(null);
        const { svg } = await mermaid.render(`mermaid-${id}`, chart.trim());

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        setError("Mermaid 圖表解析失敗，請檢查語法是否正確。");
      }
    };

    void renderChart();
  }, [chart, id, mounted]);

  if (error) {
    return <pre className="overflow-x-auto rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</pre>;
  }

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      className="mermaid my-6 min-h-12 overflow-x-auto rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
      aria-label="Mermaid diagram"
      data-mounted={mounted}
    >
      {!mounted && "Loading diagram..."}
    </div>
  );
}
