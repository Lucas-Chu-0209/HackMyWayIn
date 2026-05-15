import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import ThemeToggleFab from "@/components/ThemeToggleFab";

export const metadata: Metadata = {
  title: "Hack My Way In · Lucas Chu",
  description: "Personal brand and resume website for Lucas Chu — Creative Programmer, Developer, and Ethical Hacker.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <ThemeToggleFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
