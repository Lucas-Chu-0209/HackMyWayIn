import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/theme/ThemeProvider";
import ThemeToggleFab from "@/components/ThemeToggleFab";
import TransitionProvider from "@/components/TransitionProvider";

export const metadata: Metadata = {
  title: "Hack My Way In · Lucas Chu",
  description: "Lucas Chu's personal site — projects, writing, and notes on web development, creative coding, and security.",
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
