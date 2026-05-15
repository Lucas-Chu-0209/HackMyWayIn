interface TimelineItemProps {
  period: string;
  title: string;
  organization: string;
  bullets?: string[];
}

export default function TimelineItem({ period, title, organization, bullets }: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />
      {/* Dot */}
      <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-zinc-500 dark:bg-zinc-400 border-2 border-zinc-50 dark:border-zinc-900 ring-2 ring-zinc-300 dark:ring-zinc-600" />
      <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-1">{period}</p>
      <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{organization}</p>
      {bullets && bullets.length > 0 && (
        <ul className="space-y-1">
          {bullets.map((b, i) => (
            <li key={i} className="text-sm text-zinc-600 dark:text-zinc-300 flex gap-2">
              <span className="text-zinc-400 dark:text-zinc-500 mt-0.5">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
