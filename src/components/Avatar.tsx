// Placeholder avatar — replace with <Image src="/avatar.png" .../> or a 3D embed later
export default function Avatar() {
  return (
    <div className="relative flex items-center justify-center w-56 h-56 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-2xl select-none mx-auto">
      <span className="text-white text-6xl md:text-7xl font-bold tracking-widest">
        LC
      </span>
      {/* Decorative ring */}
      <div className="absolute inset-0 rounded-full border-4 border-white/30 pointer-events-none" />
    </div>
  );
}
