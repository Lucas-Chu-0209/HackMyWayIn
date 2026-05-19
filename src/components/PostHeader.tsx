import Image from "next/image";
import Link from "next/link";

import LiveAnalyticsCount from "@/components/analytics/LiveAnalyticsCount";
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
 *
 * Meta layout (two lines):
 *   Line 1: date ｜ N words ｜ 👁 views
 *   Line 2: Category pill ｜ Tag pills
 */
export default function PostHeader({ post, views, categorySlugMap, tagSlugMap }: PostHeaderProps) {
  const categorySlug = categorySlugMap.get(post.category);

  if (!categorySlug) {
    throw new Error(`Missing category slug for "${post.category}" in categorySlugMap. Verify taxonomy slug map generation.`);
  }

  const wordsLabel = post.wordCount != null ? `${post.wordCount.toLocaleString()} words` : null;
  const viewsLabel = views != null ? views.toLocaleString() : "—";

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

          {/* Meta line 1: date ｜ words ｜ views */}
          <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-white/85 drop-shadow">
            <span>{post.date}</span>

            {wordsLabel && (
              <>
                <span aria-hidden="true" className="opacity-50">｜</span>
                <span>{wordsLabel}</span>
              </>
            )}

            <>
              <span aria-hidden="true" className="opacity-50">｜</span>
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
                {views != null ? <LiveAnalyticsCount metric="postViews" initialValue={views} slug={post.slug} /> : viewsLabel}
              </span>
            </>
          </div>

          {/* Meta line 2: category pill ｜ tag pills */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
            <Link
              href={`/categories/${categorySlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 transition-colors hover:text-white hover:underline underline-offset-4"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-3.5 w-3.5 text-white/85"
              >
                <path
                  fill="currentColor"
                  d="M10 4l2 2h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h6z"
                />
              </svg>
              <span>{post.category}</span>
            </Link>

            {post.tags.length > 0 && (
              <>
                <span aria-hidden="true" className="text-xs text-white/50">｜</span>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
