import { GeistPixelSquare } from "geist/font/pixel";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

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
    <ClerkProvider>
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
                  <SignedOut>
                    <div className="text-sm">
                      <SignInButton />
                    </div>
                    <div className="text-sm">
                      <SignUpButton />
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <HeaderProductNavigation />
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
          <footer className="mx-auto max-w-md space-y-16 px-8 py-16">
            <div className="space-y-2 text-muted-foreground text-xs">
              <div>
                <a
                  href="https://andraindrops.notion.site/2400e5a04573800c976cfaa14bc6895a?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms
                </a>
              </div>
              <div>
                <a
                  href="https://andraindrops.notion.site/2400e5a0457380f6b1f5c0a5eefdaa25?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </div>
              <div>
                <a
                  href="https://andraindrops.notion.site/0caa536e7c764ca78a47b78d5a6015d4?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  特定商取引に関する法律に基づく表記
                </a>
              </div>
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
    </ClerkProvider>
  );
}
