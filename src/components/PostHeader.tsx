import Image from "next/image";
import Link from "next/link";

import type { PostSummary } from "@/lib/posts";

type PostHeaderProps = {
  post: PostSummary;
  /** Pass a real view count when available; omit or pass null to show "—". */
  views?: number | null;
  categorySlugMap: ReadonlyMap<string, string>;
  tagSlugMap: ReadonlyMap<string, string>;
};

/**
 * PostHeader — full-width rectangular cover banner for post detail pages.
 *
 * Height: h-80 (320 px via Tailwind utility — do NOT swap for an arbitrary value like
 *   h-[320px]; using a named utility keeps the height on the design-system scale and
 *   ensures it participates correctly in responsive/dark-mode variants).
 * Background: post.cover image, object-cover, no border.
 * Overlay: black/50 overlay so white text stays readable in all lighting.
 * Text: white, bottom-left-aligned, with a subtle drop shadow for legibility.
 * Content is aligned to the site's max-w-7xl grid.
 */
export default function PostHeader({ post, views, categorySlugMap, tagSlugMap }: PostHeaderProps) {
  const categorySlug = categorySlugMap.get(post.category);

  if (!categorySlug) {
    throw new Error(`Missing category slug for "${post.category}" in categorySlugMap. Verify taxonomy slug map generation.`);
  }

  return (
    <div className="relative h-80 overflow-hidden">
      {/* Cover image — fills the entire container, no border */}
      <Image
        src={post.cover}
        alt={`Cover image for ${post.title}`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark overlay — slightly darkens the image for text readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content — pinned to the bottom-left, aligned to max-w-7xl grid */}
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Title */}
          <h1 className="text-3xl font-bold text-white drop-shadow-md sm:text-4xl">
            {post.title}
          </h1>

          {/* Meta row: date · category · views */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/85 drop-shadow">
            <span>{post.date}</span>

            <Link
              href={`/categories/${categorySlug}`}
              className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              {post.category}
            </Link>

            <span className="flex items-center gap-1">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {views ?? "—"}
            </span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => {
                const tagSlug = tagSlugMap.get(tag);

                if (!tagSlug) {
                  throw new Error(`Missing tag slug for "${tag}" in tagSlugMap. Verify taxonomy slug map generation.`);
                }

                return (
                  <Link
                    key={tag}
                    href={`/tags/${tagSlug}`}
                    className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white/80 backdrop-blur-sm drop-shadow transition-colors hover:bg-white/25"
                  >
                    #{tag}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
