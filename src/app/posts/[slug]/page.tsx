import Link from "next/link";
import { notFound } from "next/navigation";

import BlogSidebar from "@/components/BlogSidebar";
import Navbar from "@/components/Navbar";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getAllPosts()]);

  if (!post) {
    notFound();
  }

  const tags = [...new Set(allPosts.flatMap((item) => item.tags))];
  const categories = [...new Set(allPosts.map((item) => item.category))];

  return (
    <>
      <Navbar />
      <main className="bg-zinc-100 pt-24 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
          <article className="min-w-0 w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900/50">
            <Link href="/posts" className="text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
              ← Back to posts
            </Link>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">{post.date}</p>
            <h1 className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                {post.category}
              </span>
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-4 text-zinc-700 dark:text-zinc-200">{post.content}</div>
          </article>

          <aside aria-label="Sidebar" className="hidden lg:block">
            <div className="sticky top-6">
              <div className="pr-1">
                <BlogSidebar
                  articlesCount={allPosts.length}
                  tags={tags}
                  categories={categories}
                  toc={post.toc}
                />
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t border-zinc-200 px-4 pb-12 pt-8 dark:border-zinc-800 sm:px-6 lg:hidden">
          <BlogSidebar articlesCount={allPosts.length} tags={tags} categories={categories} toc={post.toc} />
        </div>
      </main>
    </>
  );
}
