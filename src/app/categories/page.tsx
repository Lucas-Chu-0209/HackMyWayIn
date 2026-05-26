import Link from "next/link";
// 1. Import the Folder icon from your icon library
import { Folder } from "lucide-react"; 

import PageHeader from "@/components/PageHeader";
import { getAllCategories } from "@/lib/posts";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <>
      {/* Page-level cover banner */}
      <div className="pt-16">
        <PageHeader title="Categories" />
      </div>
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-large text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
              No categories yet.
            </div>
          ) : (
            /* Note: changed 'list-disc pl-6' to 'list-none pl-0' since custom icons replace the bullets */
            <ul className="list-none pl-0 space-y-3 text-zinc-700 dark:text-zinc-200">
              {categories.map((category) => (
                <li key={category.slug} className="flex items-center gap-2">
                  
                  {/* The Link now contains both the folder icon and the category name */}
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group inline-flex items-center gap-2.5 text-[18px] transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {/* 2. Added the folder icon inside the link */}
                    <Folder 
                      className="h-5 w-5 text-zinc-400 dark:text-zinc-500 transition-colors group-hover:text-zinc-700 dark:group-hover:text-zinc-300" 
                      strokeWidth={2}
                    />
                    <span className="font-medium">{category.name}</span>
                  </Link>

                  {/* The count is outside the link, sitting right after */}
                  <span className="text-zinc-500 dark:text-zinc-400 text-[16px] select-none pt-0.5">
                    ({category.count})
                  </span>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}