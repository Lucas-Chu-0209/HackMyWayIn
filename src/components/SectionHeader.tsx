interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-gray-500 text-base">{subtitle}</p>
      )}
      <div className="mt-3 w-12 h-1 bg-blue-600 rounded-full" />
    </div>
  );
}
