export default function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 text-sm font-medium bg-zinc-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-600 rounded-full">
      {label}
    </span>
  );
}
