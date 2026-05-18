import Link from "next/link";
import { notFound } from "next/navigation";

import BlogSidebar from "@/components/BlogSidebar";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import { getAllPosts, getImportantPosts, getPostsPage, getTotalPages, POSTS_PAGE_SIZE } from "@/lib/posts";

type PostsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

function parsePageParam(page: string | undefined) {
  const parsedPage = Number(page);
  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function getPaginationHref(page: number) {
  return page === 1 ? "/posts" : `/posts?page=${page}`;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const currentPage = parsePageParam((await searchParams).page);
  const [allPosts, importantPosts, totalPages, posts] = await Promise.all([
    getAllPosts(),
    getImportantPosts(),
    getTotalPages(POSTS_PAGE_SIZE),
    getPostsPage(currentPage, POSTS_PAGE_SIZE),
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
                        <Link
                          href={`/posts/${post.slug}`}
                          className="block rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-white/20"
                        >
                          <div className="flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                            <span>{post.date}</span>
                            <span>Importance {post.importance}</span>
                          </div>
                          <h2 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h2>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                              {post.category}
                            </span>
                            {post.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {totalPages > 1 && (
                    <nav aria-label="Posts pagination" className="flex flex-wrap gap-2 pt-2">
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                        const isActive = page === currentPage;

                        return (
                          <Link
                            key={page}
                            href={getPaginationHref(page)}
                            aria-current={isActive ? "page" : undefined}
                            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-colors ${
                              isActive
                                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-zinc-100"
                            }`}
                          >
                            {page}
                          </Link>
                        );
                      })}
                    </nav>
                  )}
                </>
              )}
            </div>

          <aside aria-label="Sidebar" className="hidden lg:block">
            <div className="sticky top-6">
              <div className="pr-1">
                <BlogSidebar posts={allPosts} importantPosts={importantPosts} />
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t border-zinc-200 px-4 pb-12 pt-8 dark:border-zinc-800 sm:px-6 lg:hidden">
          <BlogSidebar posts={allPosts} importantPosts={importantPosts} />
        </div>
      </main>
    </>
  );
}
