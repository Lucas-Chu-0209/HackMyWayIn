interface TimelineItemProps {
  period: string;
  title: string;
  organization: string;
  bullets?: string[];
}

export default function TimelineItem({ period, title, organization, bullets }: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-8 last:pb-0 group">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-cyan-400/35" />
      {/* Dot */}
      <div className="absolute -left-1.25 top-1 h-3 w-3 rounded-full bg-zinc-500 dark:bg-zinc-400 border-2 border-zinc-50 dark:border-zinc-900 ring-2 ring-blue-500/35 dark:ring-cyan-400/40 transition-[box-shadow,transform,background-color,ring-color] duration-300 group-hover:scale-110 group-hover:bg-zinc-600 dark:group-hover:bg-zinc-300 group-hover:ring-blue-500/70 dark:group-hover:ring-cyan-300/70 group-hover:shadow-[0_0_0_10px_rgba(59,130,246,0.18)] dark:group-hover:shadow-[0_0_0_10px_rgba(34,211,238,0.20)]"/>
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
