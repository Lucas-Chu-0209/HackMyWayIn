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
        <div className="bg-black">
          <AboutSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 bg-black border-t border-gray-800">
        © {new Date().getFullYear()} Lucas Chu · Hack My Way In
      </footer>
    </>
  );
}
