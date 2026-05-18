import Link from "next/link";

import BlogSidebar from "@/components/BlogSidebar";
import Navbar from "@/components/Navbar";
import { getAllPosts } from "@/lib/posts";

export default async function PostsPage() {
  const posts = await getAllPosts();
  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  const categories = [...new Set(posts.map((post) => post.category))];

  return (
    <>
      <Navbar />
      <main className="bg-zinc-100 pt-24 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
          <div className="flex w-full max-w-4xl flex-col gap-6">
            <header>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Posts</h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">MDX notes, build logs, and security-learning writeups.</p>
            </header>

            {posts.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
                No posts yet.
              </div>
            ) : (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="block rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-white/20"
                    >
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{post.date}</div>
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
            )}
          </div>

          <aside aria-label="Sidebar" className="hidden lg:block">
            <div className="sticky top-6">
              <div className="pr-1">
                <BlogSidebar articlesCount={posts.length} tags={tags} categories={categories} />
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t border-zinc-200 px-4 pb-12 pt-8 dark:border-zinc-800 sm:px-6 lg:hidden">
          <BlogSidebar articlesCount={posts.length} tags={tags} categories={categories} />
        </div>
      </main>
    </>
  );
}
