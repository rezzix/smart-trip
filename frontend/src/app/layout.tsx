import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Trip",
  description: "Online multiplayer educational game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a1a] text-[#e0e0ff] antialiased">
        {children}
      </body>
    </html>
  );
}
