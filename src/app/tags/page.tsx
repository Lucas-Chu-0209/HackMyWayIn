import Link from "next/link";

import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { getAllTags } from "@/lib/posts";

export default async function TagsPage() {
  const tags = await getAllTags();

  return (
    <>
      <Navbar />
      {/* Page-level cover banner */}
      <div className="pt-16">
        <PageHeader title="Tags" />
      </div>
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
          {tags.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
              No tags yet.
            </div>
          ) : (
            <section className="rounded-2xl border border-zinc-200 bg-white px-5 py-6 dark:border-white/10 dark:bg-zinc-900/50">
              <ul className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag.slug}>
                    <Link
                      href={`/tags/${tag.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                    >
                      <span>#{tag.name}</span>
                      <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-950/60 dark:text-zinc-400">
                        {tag.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
