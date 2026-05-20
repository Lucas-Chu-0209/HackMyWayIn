import type { ReactNode } from "react";

import BlogSidebar from "@/components/BlogSidebar";
import Navbar from "@/components/Navbar";
import { getSiteAnalyticsTotals } from "@/lib/analytics";
import { getAllPosts, getImportantPosts, getLatestPostDate, getTotalWordCount } from "@/lib/posts";

type BlogSidebarPageLayoutProps = {
  children: ReactNode;
};

export default async function BlogSidebarPageLayout({ children }: BlogSidebarPageLayoutProps) {
  const [allPosts, importantPosts, siteAnalytics, lastUpdated, totalWords] = await Promise.all([
    getAllPosts(),
    getImportantPosts(),
    getSiteAnalyticsTotals(),
    getLatestPostDate(),
    getTotalWordCount(),
  ]);

  return (
    <>
      <Navbar />
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
          {children}

          <aside aria-label="Sidebar" role="complementary" className="hidden lg:block lg:py-16">
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
