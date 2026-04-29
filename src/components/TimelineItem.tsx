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
      <div className="absolute left-0 top-0 bottom-0 w-px bg-emerald-200 last:hidden" />
      {/* Dot */}
      <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-200" />
      <p className="text-xs font-mono text-emerald-600 mb-1">{period}</p>
      <h4 className="text-base font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mb-2">{organization}</p>
      {bullets && bullets.length > 0 && (
        <ul className="space-y-1">
          {bullets.map((b, i) => (
            <li key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-emerald-500 mt-0.5">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
