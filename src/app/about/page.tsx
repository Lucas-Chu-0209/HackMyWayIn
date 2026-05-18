import AboutSection from "@/components/AboutSection";
import BlogSidebar from "@/components/BlogSidebar";
import ContactSection from "@/components/ContactSection";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import ProjectsSection from "@/components/ProjectsSection";
import { getAllPosts, getImportantPosts } from "@/lib/posts";

export default async function AboutPage() {
  const [allPosts, importantPosts] = await Promise.all([getAllPosts(), getImportantPosts()]);

  return (
    <>
      <Navbar />
      {/* Page-level cover banner */}
      <div className="pt-16">
        <PageHeader title="About" />
      </div>
      <main className="bg-zinc-100 dark:bg-zinc-950">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
          <div className="min-w-0 flex w-full max-w-4xl flex-col gap-8">
            <header className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-10 shadow-sm dark:border-white/10 dark:bg-zinc-900/50 sm:px-8">
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Home now focuses on the latest writing. This page keeps the personal profile, featured projects, and contact details together in one place.
              </p>
            </header>
            <AboutSection />
            <ProjectsSection />
            <ContactSection />
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
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 text-center text-sm text-zinc-500">
        © 2026 Lucas Chu · Hack My Way In
      </footer>
    </>
  );
}
