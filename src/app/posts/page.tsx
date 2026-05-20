import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";

import BlogSidebar from "@/components/BlogSidebar";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PostListItem from "@/components/posts/PostListItem";
import { getSiteAnalyticsTotals } from "@/lib/analytics";
import {
  getAllPosts,
  getCategorySlugMap,
  getImportantPosts,
  getLatestPostDate,
  getPostsPage,
  getTagSlugMap,
  getTotalWordCount,
  getTotalPages,
  POSTS_PAGE_SIZE,
} from "@/lib/posts";

type PostsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

type PaginationDisplayItem = number | "ellipsis-left" | "ellipsis-right";
// Keep compact pagination only when page count is small enough to avoid truncation.
const MAX_PAGES_WITHOUT_ELLIPSIS = 4;

function parsePageParam(page: string | undefined) {
  const parsedPage = Number(page);
  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function getPaginationHref(page: number) {
  return page === 1 ? "/posts" : `/posts?page=${page}`;
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationDisplayItem[] {
  if (totalPages <= MAX_PAGES_WITHOUT_ELLIPSIS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3, "ellipsis-right", totalPages];
  }

  if (currentPage >= totalPages - 1) {
    return [1, "ellipsis-left", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis-left", currentPage - 1, currentPage, currentPage + 1, "ellipsis-right", totalPages];
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  noStore();

  const currentPage = parsePageParam((await searchParams).page);
  const [allPosts, importantPosts, totalPages, posts, categorySlugMap, tagSlugMap, siteAnalytics, lastUpdated, totalWords] = await Promise.all([
    getAllPosts(),
    getImportantPosts(),
    getTotalPages(POSTS_PAGE_SIZE),
    getPostsPage(currentPage, POSTS_PAGE_SIZE),
    getCategorySlugMap(),
    getTagSlugMap(),
    getSiteAnalyticsTotals(),
    getLatestPostDate(),
    getTotalWordCount(),
  ]);

  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <>
      <Navbar />
      {/* Page-level cover banner */}
      <div className="pt-16">
        <PageHeader title="Posts" />
      </div>
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
          <div className="flex w-full max-w-4xl flex-col gap-6">
            {/* <header>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                MDX notes, build logs, and security-learning writeups.
              </p>
            </header> */}

            {posts.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
                No posts yet.
              </div>
            ) : (
              <>
                <ul className="space-y-4">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <PostListItem post={post} categorySlugMap={categorySlugMap} tagSlugMap={tagSlugMap} />
                    </li>
                  ))}
                </ul>

                {totalPages > 1 && (
                  <nav aria-label="Posts pagination" className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {currentPage > 1 ? (
                      <Link
                        href={getPaginationHref(currentPage - 1)}
                        aria-label="Go to previous page"
                        className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-zinc-100"
                      >
                        <span aria-hidden="true">←</span>
                        <span>Previous</span>
                      </Link>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="invisible inline-flex h-10 items-center justify-center gap-1 rounded-xl border px-3 text-sm font-medium"
                      >
                        <span>←</span>
                        <span>Previous</span>
                      </span>
                    )}

                    {getPaginationItems(currentPage, totalPages).map((item) => {
                      if (typeof item !== "number") {
                        return (
                          <span key={item} aria-hidden="true" className="inline-flex h-10 min-w-10 items-center justify-center text-zinc-500 dark:text-zinc-400">
                            …
                          </span>
                        );
                      }

                      const isActive = item === currentPage;

                      return (
                        <Link
                          key={item}
                          href={getPaginationHref(item)}
                          aria-label={`Go to page ${item}`}
                          aria-current={isActive ? "page" : undefined}
                          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors ${
                            isActive
                              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                              : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-zinc-100"
                          }`}
                        >
                          {item}
                        </Link>
                      );
                    })}

                    {currentPage < totalPages ? (
                      <Link
                        href={getPaginationHref(currentPage + 1)}
                        aria-label="Go to next page"
                        className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-zinc-100"
                      >
                        <span>Next</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="invisible inline-flex h-10 items-center justify-center gap-1 rounded-xl border px-3 text-sm font-medium"
                      >
                        <span>Next</span>
                        <span>→</span>
                      </span>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>

          <aside aria-label="Sidebar" className="hidden lg:block">
            <div className="sticky top-6">
              <div className="pr-1">
                <BlogSidebar
                  posts={allPosts}
                  importantPosts={importantPosts}
                  totalWords={totalWords}
                  totalViews={siteAnalytics.totalViews}
                  totalVisitors={siteAnalytics.totalVisitors}
                  lastUpdated={lastUpdated}
                />
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t border-zinc-200 px-4 pb-12 pt-8 dark:border-zinc-800 sm:px-6 lg:hidden">
          <BlogSidebar
            posts={allPosts}
            importantPosts={importantPosts}
            totalWords={totalWords}
            totalViews={siteAnalytics.totalViews}
            totalVisitors={siteAnalytics.totalVisitors}
            lastUpdated={lastUpdated}
          />
        </div>
      </main>
    </>
  );
}
