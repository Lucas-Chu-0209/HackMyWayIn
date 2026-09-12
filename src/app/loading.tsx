import NavigationStatus from "@/components/NavigationStatus";

export default function Loading() {
  return (
    <main aria-busy="true" className="min-h-[60vh] bg-zinc-100 pt-32 dark:bg-zinc-950">
      <NavigationStatus />
    </main>
  );
}
