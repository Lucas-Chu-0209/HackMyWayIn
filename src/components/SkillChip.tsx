export default function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-900/40 text-blue-300 border border-blue-700 rounded-full">
      {label}
    </span>
  );
}
