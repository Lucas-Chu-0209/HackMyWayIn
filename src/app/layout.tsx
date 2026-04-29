import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
