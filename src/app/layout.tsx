import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GITWAR — The Middle East War Game",
  description: "Hold $GITWAR tokens, choose your side, and fly into battle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
