"use client"

export function Footer() {
  return (
    <footer className="flex items-center justify-center px-6 py-4 text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
      © {new Date().getFullYear()} DocumentSign Storage. Blockchain-secured document verification.
    </footer>
  );
}