"use client";

import { WagmiConfig } from 'wagmi';
import { config } from '@/lib/wagmi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-col">
        <WagmiConfig config={config}>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </WagmiConfig>
      </body>
    </html>
  );
}