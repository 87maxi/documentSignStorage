"use client";

import DocumentVerification from '@/components/DocumentVerification';

export default function Home() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Document Sign & Storage
          </h1>
          <p className="text-lg text-gray-600">
            Securely verify and store document signatures on the blockchain
          </p>
        </div>
        
        <DocumentVerification />
      </div>
    </div>
  );
}