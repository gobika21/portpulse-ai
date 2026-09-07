import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { DirectionProvider } from "@/components/DirectionProvider";
import { PortBackground } from "@/components/PortBackground";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PortPulse — Port Traffic Reports",
  description: "See which major ports are backed up right now, and get plain-English advice on what to do about it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <PortBackground />
        <DirectionProvider>
          <Header />
          <main>{children}</main>
        </DirectionProvider>
      </body>
    </html>
  );
}
