export default function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200 rounded-full">
      {label}
    </span>
  );
}
