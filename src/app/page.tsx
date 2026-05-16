import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div className="bg-zinc-100 dark:bg-zinc-950">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:px-8 xl:px-10">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:mx-0">
              <AboutSection />
              <ProjectsSection />
              <ContactSection />
            </div>
            <aside aria-hidden="true" className="hidden lg:block">
              <div className="sticky top-24 min-h-px" />
            </aside>
          </div>
        </div>
      </main>
      <footer className="border-t border-zinc-800 bg-zinc-950 py-6 text-center text-sm text-zinc-500">
        © 2026 Lucas Chu · Hack My Way In
      </footer>
    </>
  );
}
