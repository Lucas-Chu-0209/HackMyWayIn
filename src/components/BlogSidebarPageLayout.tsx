import { unstable_noStore as noStore } from "next/cache";
import type { ReactNode } from "react";

import BlogSidebar from "@/components/BlogSidebar";
import { getSiteAnalyticsTotals } from "@/lib/analytics";
import { getAllPosts, getImportantPosts, getLatestPostDate, getTotalWordCount } from "@/lib/posts";

/**
 * Shared layout wrapper that renders the two-column grid (main content + BlogSidebar).
 * Handles responsive behaviour: desktop sidebar is sticky in the right column;
 * on small screens the sidebar moves below the main content.
 *
 * Usage: wrap the page-specific content (no Navbar, no PageHeader) with this component.
 */
export default async function BlogSidebarPageLayout({ children }: { children: ReactNode }) {
  noStore();

  const [allPosts, importantPosts, siteAnalytics, lastUpdated, totalWords] = await Promise.all([
    getAllPosts(),
    getImportantPosts(),
    getSiteAnalyticsTotals(),
    getLatestPostDate(),
    getTotalWordCount(),
  ]);

  return (
    <main className="bg-zinc-100 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
        <div className="min-w-0">{children}</div>

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

      {/* Mobile sidebar — shown below main content on small screens */}
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
  );
}
