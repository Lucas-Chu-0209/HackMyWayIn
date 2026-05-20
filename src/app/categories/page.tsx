import Link from "next/link";

import BlogSidebarPageLayout from "@/components/BlogSidebarPageLayout";
import PageHeader from "@/components/PageHeader";
import { getAllCategories } from "@/lib/posts";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      <div className="pt-16">
        <PageHeader title="Categories" />
      </div>
      <BlogSidebarPageLayout>
        {categories.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
            No categories yet.
          </div>
        ) : (
          <ul className="list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-200">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center gap-2 text-sm transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <span className="font-medium">{category.name}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">({category.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </BlogSidebarPageLayout>
    </>
  );
}
