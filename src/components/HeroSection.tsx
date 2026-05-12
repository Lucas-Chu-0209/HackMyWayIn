"use client";
import Image from "next/image";
import { siteConfig } from "@/content";
import TypingText from "./TypingText";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  const typingMessages = [
    siteConfig.roles.join(", "),
    "Keep exploring and learning!",
    "Feel free to connect!",
  ];
  const TYPING_LINE_MIN_HEIGHT = "clamp(64px, 6vw, 72px)";

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#050816] pt-16">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Background image */}
        <Image
          src="/Hack_My_Way_In_bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-100"
        />

        {/* Readability overlay: 用比較溫和的方式，只在下方/邊緣變暗 */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70" /> */}

        {/* Optional: very subtle vignette（讓四周稍暗、中間稍亮，更看得到圖） */}
        {/* <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0.45)_60%,rgba(0,0,0,0.75)_100%)]" /> */}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col items-center text-center gap-0">
            <Image
              src="/Hack_My_Way_In_1200x400.png"
              alt="Hack My Way In logo"
              width={1200}
              height={400}
              className="h-32 w-auto sm:h-36 md:h-40"
              priority
            />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-100 leading-tight mb-4">
            I&apos;m {siteConfig.name}.
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 font-semibold mb-4" style={{ minHeight: TYPING_LINE_MIN_HEIGHT }}>
            <TypingText sentences={typingMessages} />
          </p>
          <p className="text-base text-slate-300 max-w-lg mb-8">
            {siteConfig.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
      </div>
    </section>
  );
}
