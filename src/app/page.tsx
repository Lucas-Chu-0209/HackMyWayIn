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
        <div className="bg-white dark:bg-zinc-950">
          <AboutSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-zinc-500 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        © {new Date().getFullYear()} Lucas Chu · Hack My Way In
      </footer>
    </>
  );
}
