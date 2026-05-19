import Image from "next/image";
import Link from "next/link";

import type { PostSummary } from "@/lib/posts";

type PostListItemProps = {
  post: PostSummary;
  headingTag?: "h2" | "h3";
  categorySlugMap: ReadonlyMap<string, string>;
  tagSlugMap: ReadonlyMap<string, string>;
};

export default function PostListItem({ post, headingTag = "h2", categorySlugMap, tagSlugMap }: PostListItemProps) {
  const HeadingTag = headingTag;
  const categorySlug = categorySlugMap.get(post.category);

  if (!categorySlug) {
    throw new Error(`Missing category slug for "${post.category}" in categorySlugMap. Verify taxonomy slug map generation.`);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-white/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Link
          href={`/posts/${post.slug}`}
          aria-label={`Read article: ${post.title}`}
          className="group relative block w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 sm:w-64 sm:flex-none"
        >
          <div className="relative aspect-video w-full">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Link
              href={`/categories/${categorySlug}`}
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              {post.category}
            </Link>
            <span aria-hidden="true">•</span>
            <span>{post.date}</span>
          </div>
          <HeadingTag className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            <Link href={`/posts/${post.slug}`} className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
              {post.title}
            </Link>
          </HeadingTag>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => {
              const tagSlug = tagSlugMap.get(tag);

              if (!tagSlug) {
                throw new Error(`Missing tag slug for "${tag}" in tagSlugMap. Verify taxonomy slug map generation.`);
              }

              return (
                <Link
                  key={tag}
                  href={`/tags/${tagSlug}`}
                  className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                >
                  #{tag}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}
