import { contactLinks } from "@/content";
import { getCategorySlugMap, getTagSlugMap } from "@/lib/posts";
import type { PostSummary, TocItem } from "@/lib/posts";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

function SocialIcon({ icon }: { icon: string }) {
  const cls = "h-5 w-5";
  switch (icon) {
    case "email":
      return (
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          className={cls}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case "github":
      return (
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case "linkedin":
      return (
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "instagram":
      return (
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "facebook":
      return (
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className={cls} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    default:
      return null;
  }
}

type BlogSidebarProps = {
  posts?: PostSummary[];
  articlesCount?: number;
  tags?: string[];
  categories?: string[];
  importantPosts?: PostSummary[];
  toc?: TocItem[];
  totalWords?: number;
  totalViews?: number;
  totalVisitors?: number;
  lastUpdated?: string | null;
};

function SidebarSectionTitle({
  iconClassName,
  title,
  children,
}: {
  iconClassName: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
      <span className={iconClassName} aria-hidden="true">
        {children}
      </span>
      <span>{title}</span>
    </h2>
  );
}

export default async function BlogSidebar({
  posts,
  articlesCount,
  tags,
  categories,
  importantPosts,
  toc,
  totalWords = 0,
  totalViews = 0,
  totalVisitors = 0,
  lastUpdated,
}: BlogSidebarProps) {
  const allPosts = posts ?? [];
  const resolvedArticlesCount = articlesCount ?? allPosts.length;
  const resolvedTags = tags ?? [...new Set(allPosts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));
  const resolvedCategories = categories ?? [...new Set(allPosts.map((post) => post.category))].sort((a, b) => a.localeCompare(b));
  const resolvedImportantPosts = importantPosts ?? [];
  const resolvedToc = toc ?? [];
  const [tagSlugMap, categorySlugMap] = await Promise.all([getTagSlugMap(), getCategorySlugMap()]);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900/50">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-40 w-40 overflow-hidden rounded-full">
            <Image
              src="/images/4C8A2320.jpg"
              alt="Lucas Chu avatar"
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Lucas Chu</div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">I LOVE cats.</div>
        </div>

        <div className="mt-5 grid grid-cols-2 text-center">
            <Link
              href="/posts"
              className="group rounded-xl px-2 py-2 transition-colors hover:bg-zinc-100/70 dark:hover:bg-white/5"
            >
              <div className="text-xs font-medium text-zinc-500 transition-colors group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200">
                Articles
              </div>
              <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{resolvedArticlesCount}</div>
            </Link>

          <div className="rounded-xl px-2 py-2">
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Hacker Space</div>
            <div className="mt-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200">Coming soon</div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          {contactLinks.map((link) => (
            <a
              key={link.icon}
              href={link.href}
              target={link.icon !== "email" ? "_blank" : undefined}
              rel={link.icon !== "email" ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-200"
            >
              <SocialIcon icon={link.icon} />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-zinc-900/50">
        <SidebarSectionTitle iconClassName="text-amber-500 dark:text-amber-400" title="Featured">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="m11.48 3.5-2.162 4.375-4.828.702 3.495 3.407-.825 4.808L11.48 14.52l4.32 2.272-.825-4.808 3.494-3.407-4.827-.702L11.48 3.5Z" />
          </svg>
        </SidebarSectionTitle>
        {resolvedImportantPosts.length === 0 ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">No featured posts yet.</p>
        ) : (
          <div className="space-y-3">
            {resolvedImportantPosts.slice(0, 5).map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="block rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/10 dark:bg-zinc-950/40 dark:hover:border-white/20 dark:hover:bg-zinc-950/70"
              >
                <div className="flex items-center justify-between gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span className="truncate">{post.category}</span>
                  <span className="whitespace-nowrap">Importance {post.importance}</span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{post.date}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {resolvedToc.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-zinc-900/50">
          <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Table of Contents</h2>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
            {resolvedToc.map((item) => (
              <li key={item.id} className={item.level === 3 ? "pl-4" : "pl-0"}>
                <a href={`#${item.id}`} className="hover:text-zinc-900 dark:hover:text-zinc-100">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-zinc-900/50">
        <SidebarSectionTitle iconClassName="text-sky-500 dark:text-sky-400" title="Tags">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M3 11l8.59 8.59a2 2 0 002.82 0l6.18-6.18a2 2 0 000-2.82L12 2H5a2 2 0 00-2 2v7z" />
          </svg>
        </SidebarSectionTitle>
        {resolvedTags.length === 0 ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">No tags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {resolvedTags.map((tag) => {
              const tagSlug = tagSlugMap.get(tag);

              if (!tagSlug) {
                throw new Error(`Missing tag slug for "${tag}" in tagSlugMap. Verify taxonomy slug map generation.`);
              }

              return (
                <Link
                  key={tag}
                  href={`/tags/${tagSlug}`}
                  className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                >
                  #{tag}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-zinc-900/50">
        <SidebarSectionTitle iconClassName="text-emerald-500 dark:text-emerald-400" title="Categories">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
        </SidebarSectionTitle>
        {resolvedCategories.length === 0 ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">No categories yet.</p>
        ) : (
          <div className="space-y-2">
            {resolvedCategories.map((category) => {
              const categorySlug = categorySlugMap.get(category);

              if (!categorySlug) {
                throw new Error(`Missing category slug for "${category}" in categorySlugMap. Verify taxonomy slug map generation.`);
              }

              return (
                <Link
                  key={category}
                  href={`/categories/${categorySlug}`}
                  className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
                >
                  <span>{category}</span>
                  <span className="text-zinc-400 dark:text-zinc-500">Category</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-zinc-900/50">
        <SidebarSectionTitle iconClassName="text-violet-500 dark:text-violet-400" title="Site Info">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </SidebarSectionTitle>
        <dl className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center justify-between">
            <dt>Articles</dt>
            <dd className="font-medium text-zinc-700 dark:text-zinc-300">{resolvedArticlesCount}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Total Words</dt>
            <dd className="font-medium text-zinc-700 dark:text-zinc-300">{totalWords.toLocaleString()}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Total Views</dt>
            <dd className="font-medium text-zinc-700 dark:text-zinc-300">{totalViews.toLocaleString()}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Visitors</dt>
            <dd className="font-medium text-zinc-700 dark:text-zinc-300">{totalVisitors.toLocaleString()}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Last Updated</dt>
            <dd className="font-medium text-zinc-700 dark:text-zinc-300">{lastUpdated ?? "—"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
