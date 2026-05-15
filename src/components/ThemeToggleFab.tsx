"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore, useState } from "react";
import { createPortal } from "react-dom";

// A stable no-op subscribe function for useSyncExternalStore.
const emptySubscribe = () => () => {};

export default function ThemeToggleFab() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

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

  return createPortal(
    // pointer-events-none on the outer layer so it never blocks page clicks.
    <div className="pointer-events-none fixed inset-0 z-[2147483647]">
      {/* Theme circle — visible only when gear is open */}
      {open && (
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="pointer-events-auto absolute bottom-[5.25rem] right-6 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 text-zinc-100 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100"
          aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            // Sun: clicking this switches to light
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            </svg>
          ) : (
            // Moon: clicking this switches to dark
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z" />
            </svg>
          )}
        </button>
      )}

      {/* Gear button — toggles open state */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`pointer-events-auto absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-zinc-100 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:bg-zinc-100 dark:text-zinc-900 ${open ? "rotate-45" : ""}`}
        aria-label={open ? "Close settings" : "Open settings"}
        title={open ? "Close settings" : "Open settings"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
      </button>
    </div>,
    document.body
  );
}
