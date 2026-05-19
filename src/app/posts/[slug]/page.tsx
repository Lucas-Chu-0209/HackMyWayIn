import Link from "next/link";
import { notFound } from "next/navigation";

import BlogSidebar from "@/components/BlogSidebar";
import Navbar from "@/components/Navbar";
import PostHeader from "@/components/PostHeader";
import { getAllPosts, getCategorySlugMap, getImportantPosts, getPostBySlug, getTagSlugMap } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const [post, allPosts, importantPosts, categorySlugMap, tagSlugMap] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
    getImportantPosts(),
    getCategorySlugMap(),
    getTagSlugMap(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />

      {/* Cover header — full-width, sits directly under the fixed navbar */}
      <div className="pt-16">
        <PostHeader post={post} categorySlugMap={categorySlugMap} tagSlugMap={tagSlugMap} />
      </div>

      <main className="bg-zinc-100 dark:bg-zinc-950">
        {/* "Back to posts" link — just above the article grid */}
        <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8 xl:px-10">
          <Link
            href="/posts"
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to posts
          </Link>
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
          <article className="w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-zinc-900/50">
            {/* Article body — title/meta are shown in PostHeader above; content starts here.
                post.content is a React element compiled from trusted local MDX files in
                src/content/posts/ via next-mdx-remote/rsc — not from user/external input. */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {post.content}
            </div>
          </article>

          <aside aria-label="Sidebar" className="hidden lg:block">
            <div className="sticky top-6">
              <div className="pr-1">
                <BlogSidebar posts={allPosts} importantPosts={importantPosts} toc={post.toc} />
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t border-zinc-200 px-4 pb-12 pt-8 dark:border-zinc-800 sm:px-6 lg:hidden">
          <BlogSidebar posts={allPosts} importantPosts={importantPosts} toc={post.toc} />
        </div>
      </main>
    </>
  );
}
