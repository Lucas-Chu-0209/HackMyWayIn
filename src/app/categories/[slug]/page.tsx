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
      <div className="col-span-full pt-16">
        <PageHeader title={result.category.name} />
      </div>
      <div className="min-w-0 max-w-4xl py-16">
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
    </>
  );
}
