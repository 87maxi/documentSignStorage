// web/src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WagmiProviderWrapper from "../lib/WagmiProviderWrapper";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--geist-mono",
});

export const metadata: Metadata = {
  title: "Document Verification DApp",
  description: "Verify document signatures on the blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProviderWrapper>
          {children}
        </WagmiProviderWrapper>
      </body>
    </html>
  );
}

