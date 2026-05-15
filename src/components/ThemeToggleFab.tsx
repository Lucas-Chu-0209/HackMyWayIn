"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// A stable no-op subscribe function for useSyncExternalStore.
const emptySubscribe = () => () => {};

export default function ThemeToggleFab() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Returns true only on the client, false during SSR — avoids hydration mismatch.
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // All hooks are called unconditionally above; conditional return is safe here.
  if (!isClient) return null;

  const activeTheme = (theme === "system" ? resolvedTheme : theme) ?? "dark";
  const isDark = activeTheme === "dark";

  const button = (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[9999]">
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="pointer-events-auto cursor-pointer rounded-full bg-zinc-900 p-3 text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 dark:bg-zinc-100 dark:text-zinc-900"
        aria-label="Toggle dark/light mode"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {/* Gear icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );

  return createPortal(button, document.body);
}
