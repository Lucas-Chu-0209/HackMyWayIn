import { notFound } from "next/navigation";

import PageHeader from "@/components/PageHeader";
import PostListItem from "@/components/posts/PostListItem";
import { getAllTags, getCategorySlugMap, getPostsByTagSlug } from "@/lib/posts";

type TagPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const [result, categorySlugMap] = await Promise.all([
    getPostsByTagSlug(slug),
    getCategorySlugMap(),
  ]);

  if (!result) {
    notFound();
  }

  return (
    <>
      <div className="pt-16">
        <PageHeader title={`#${result.tag.name}`} />
      </div>
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 xl:px-10">
          {result.posts.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
              No posts found for this tag.
            </div>
          ) : (
            <ul className="space-y-4">
              {result.posts.map((post) => (
                <li key={post.slug}>
                  <PostListItem post={post} categorySlugMap={categorySlugMap} tagSlugMap={result.tagSlugMap} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
