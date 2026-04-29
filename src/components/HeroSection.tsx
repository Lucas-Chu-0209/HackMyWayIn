"use client";
import { siteConfig } from "@/content";
import Avatar from "./Avatar";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen flex items-center bg-[#F7F7F5] pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <p className="inline-block text-sm font-mono text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-4">
              {siteConfig.brand}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              I&apos;m {siteConfig.name}.
            </h1>
            <p className="text-xl sm:text-2xl text-blue-700 font-semibold mb-4">
              {siteConfig.roles.join(", ")}.
            </p>
            <p className="text-base text-gray-500 max-w-lg mb-8 mx-auto md:mx-0">
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
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
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
