import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";

export default function TagsPage() {
  return (
    <>
      <Navbar />
      {/* Page-level cover banner */}
      <div className="pt-16">
        <PageHeader title="Tags" />
      </div>
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Coming soon — all tags will be listed here.
          </p>
        </div>
      </main>
    </>
  );
}
