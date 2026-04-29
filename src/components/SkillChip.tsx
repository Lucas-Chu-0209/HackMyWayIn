export default function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
      {label}
    </span>
  );
}
