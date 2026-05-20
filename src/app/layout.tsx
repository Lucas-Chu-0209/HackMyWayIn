import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/theme/ThemeProvider";
import ThemeToggleFab from "@/components/ThemeToggleFab";
import TransitionProvider from "@/components/TransitionProvider";

export const metadata: Metadata = {
  title: "Hack My Way In · Lucas Chu",
  description: "Personal brand and resume website for Lucas Chu — Creative Programmer, Developer, and Ethical Hacker.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <ThemeProvider>
          <Navbar />
          <TransitionProvider>{children}</TransitionProvider>
          <ThemeToggleFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
