import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import BlogSidebar from "@/components/BlogSidebar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div className="bg-zinc-100 dark:bg-zinc-950">
          {/* Desktop: two-column grid with sticky sidebar */}
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 xl:px-10">
            {/* Main content — wider + no centering inside the column */}
            <div className="min-w-0 flex w-full max-w-4xl flex-col gap-8">
              <AboutSection />
              <ProjectsSection />
              <ContactSection />
            </div>

            {/* Desktop sidebar — sticky, height-constrained, internally scrollable */}
            <aside aria-label="Sidebar" className="hidden lg:block">
              <div className="sticky top-6">
                <div className="pr-1">
                  <BlogSidebar />
                </div>
              </div>
            </aside>
          </div>

          {/* Mobile sidebar — below main content, above footer */}
          <div className="border-t border-zinc-200 px-4 pb-12 pt-8 dark:border-zinc-800 sm:px-6 lg:hidden">
            <div className="w-full">
              <BlogSidebar />
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
