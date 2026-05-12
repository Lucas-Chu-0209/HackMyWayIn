"use client";
import { siteConfig } from "@/content";
import Avatar from "./Avatar";
import TypingText from "./TypingText";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  const typingMessages = [
    siteConfig.roles.join(", "),
    "Keep exploring and learning",
    "Feel free to connect",
  ];
  const TYPING_LINE_MIN_HEIGHT = "clamp(64px, 6vw, 72px)";

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#050816] pt-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <svg className="absolute inset-0 h-full w-full opacity-35" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid-pattern" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0H0V44" fill="none" stroke="rgba(34, 211, 238, 0.28)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
        </svg>
        <div className="absolute -left-28 top-8 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-32 right-[-6rem] h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/88 to-[#050816]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <p className="inline-block text-sm font-mono text-cyan-200 bg-slate-900/75 border border-cyan-400/40 rounded-full px-3 py-1 mb-4">
              {siteConfig.brand}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight mb-4">
              I&apos;m {siteConfig.name}.
            </h1>
            <p className="text-xl sm:text-2xl text-cyan-300 font-semibold mb-4" style={{ minHeight: TYPING_LINE_MIN_HEIGHT }}>
              <TypingText sentences={typingMessages} />
            </p>
            <p className="text-base text-slate-300 max-w-lg mb-8 mx-auto md:mx-0">
              {siteConfig.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => scrollToSection("contact")}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                {siteConfig.ctaPrimary}
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="px-6 py-3 rounded-xl border-2 border-slate-500 text-slate-100 font-semibold hover:border-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                {siteConfig.ctaSecondary}
              </button>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar />
          </div>
        </div>
      </div>
    </section>
  );
}
