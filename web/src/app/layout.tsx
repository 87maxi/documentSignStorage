import React from 'react';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocumentSign Storage",
  description: "Blockchain-secured document verification and storage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body className="font-sans bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <div className="min-h-screen flex flex-col">
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">DocumentSign</h1>
            </div>
            <div className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full font-mono">
              {"0xf39...266"}
            </div>
          </header>
          <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <footer className="flex items-center justify-center px-6 py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            © {new Date().getFullYear()} DocumentSign Storage. Blockchain-secured document verification.
          </footer>
        </div>
      </body>
    </html>
  );
}
