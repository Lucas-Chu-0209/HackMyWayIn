import Link from "next/link";

import BlogSidebar from "@/components/BlogSidebar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { getAllPosts, getImportantPosts, getPostsPage, POSTS_PAGE_SIZE } from "@/lib/posts";

export default async function Home() {
  const [latestPosts, allPosts, importantPosts] = await Promise.all([
    getPostsPage(1, POSTS_PAGE_SIZE),
    getAllPosts(),
    getImportantPosts(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div className="bg-zinc-100 dark:bg-zinc-950">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
            <div className="min-w-0 flex w-full max-w-4xl flex-col gap-8">
              <section className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-14 shadow-sm dark:border-white/10 dark:bg-zinc-900/50 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Latest Posts</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Fresh notes from the lab
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                      The newest write-ups, build logs, and learning notes live here. Browse the latest nine entries or jump to the full archive.
                    </p>
                  </div>
                  <Link
                    href="/posts"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-zinc-100"
                  >
                    View all posts
                  </Link>
                </div>

                {latestPosts.length === 0 ? (
                  <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-400">
                    No posts yet. Add an MDX file in <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">src/content/posts</code> to populate the home feed.
                  </div>
                ) : (
                  <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {latestPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/posts/${post.slug}`}
                        className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-950/40 dark:hover:border-white/20"
                      >
                        <div className="flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{post.category}</span>
                          <span>{post.date}</span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
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
            <div className="w-full">
              <BlogSidebar posts={allPosts} importantPosts={importantPosts} />
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 text-center text-sm text-zinc-500">
        © 2026 Lucas Chu · Hack My Way In
      </footer>
    </>
  );
}
