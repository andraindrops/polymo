import { GeistPixelSquare } from "geist/font/pixel";
import { Github } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

import HeaderProductNavigation from "@/components/shared/headerProductNavigation";
import Tracking from "@/components/shared/tracking";

export const metadata: Metadata = {
  title: "Polymo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistPixelSquare.variable} antialiased`}>
        <div className="flex min-h-lvh flex-col">
          <header className="mx-auto w-full max-w-md p-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/icon.svg"
                  alt="Polymo"
                  width={28}
                  height={28}
                  className="rounded"
                />
                <span className="font-bold text-lg">Polymo</span>
              </Link>
              <div className="flex items-center gap-4">
                <HeaderProductNavigation />
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
        <footer className="mx-auto max-w-md space-y-16 px-8 py-16">
          <div className="flex justify-center">
            <a
              href="https://github.com/andraindrops/polymo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground opacity-80 hover:opacity-100"
              aria-label="Polymo GitHub repository"
            >
              <Github size={20} />
            </a>
          </div>
          <div className="space-y-2 text-center text-muted-foreground text-xs">
            <a
              href="https://www.andraindrops.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              and raindrops, Inc.
            </a>
          </div>
        </footer>
        <Tracking gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
