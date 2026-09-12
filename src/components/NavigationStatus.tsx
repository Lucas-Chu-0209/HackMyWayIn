export default function NavigationStatus() {
  return (
    <span role="status" className="pointer-events-none fixed left-1/2 top-20 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
      <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-zinc-300 border-t-emerald-600 motion-safe:animate-spin dark:border-zinc-600 dark:border-t-emerald-400" />
      Loading page…
    </span>
  );
}
