import Link from "next/link";

import BlogSidebar from "@/components/BlogSidebar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PostListItem from "@/components/posts/PostListItem";
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
              <section className="rounded-3xl bg-zinc-50/70 px-4 py-10 dark:bg-zinc-900/30 sm:px-5 lg:px-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">Latest Posts</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Fresh notes from the lab
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    The newest write-ups, build logs, and learning notes live here. Browse the latest nine entries or jump to the full archive.
                  </p>
                </div>

                {latestPosts.length === 0 ? (
                  <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white/80 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-400">
                    No posts yet. Add an MDX file in <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">src/content/posts</code> to populate the home feed.
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {latestPosts.map((post) => (
                      <PostListItem key={post.slug} post={post} headingTag="h3" />
                    ))}

                    <div className="pt-6 text-center">
                      <p className="text-lg leading-none text-zinc-400 dark:text-zinc-500">
                        <span aria-hidden="true">…</span>
                        <span className="sr-only">More posts available</span>
                      </p>
                      <Link
                        href="/posts"
                        className="mt-4 inline-flex items-center justify-center rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-zinc-100"
                      >
                        View all posts
                      </Link>
                    </div>
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
