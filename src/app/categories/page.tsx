import Link from "next/link";

import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { getAllCategories } from "@/lib/posts";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <Navbar />
      {/* Page-level cover banner */}
      <div className="pt-16">
        <PageHeader title="Categories" />
      </div>
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
              No categories yet.
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-white/20 dark:hover:text-zinc-100"
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
