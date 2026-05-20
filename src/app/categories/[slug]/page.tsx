import { notFound } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import PostListItem from "@/components/posts/PostListItem";
import { getAllCategories, getPostsByCategorySlug, getTagSlugMap } from "@/lib/posts";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [result, tagSlugMap] = await Promise.all([
    getPostsByCategorySlug(slug),
    getTagSlugMap(),
  ]);

  if (!result) {
    notFound();
  }

  return (
    <>
      <div className="pt-16">
        <PageHeader title={result.category.name} />
      </div>
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
          {result.posts.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
              No posts found for this category.
            </div>
          ) : (
            <ul className="space-y-4">
              {result.posts.map((post) => (
                <li key={post.slug}>
                  <PostListItem post={post} categorySlugMap={result.categorySlugMap} tagSlugMap={tagSlugMap} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
