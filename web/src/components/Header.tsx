"use client"

import { ReactNode } from 'react';

export function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <h1 className="text-xl font-semibold text-gray-800">DocumentSign</h1>
      </div>
      {children}
    </header>
  );
}