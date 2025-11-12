"use client";

import React from "react";

interface FooterProps {
  loading?: boolean;
  transactionHash?: string;
  confirmations?: number;
  status?: string;
}

const Footer: React.FC<FooterProps> = ({
  loading = false,
  transactionHash,
  confirmations = 0,
  status,
}) => {
  if (loading) {
    return (
      <footer className="bg-gray-50 border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">{status || "Processing transaction..."}</span>
          </div>
          <div className="text-xs text-gray-500">
            Confirmations: {confirmations}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs text-gray-500">
          {transactionHash ? (
            <>
              Transaction: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
              </a>
            </>
          ) : (
            "Document Sign & Storage - Blockchain-powered document verification and storage"
          )}
        </p>
      </div>
    </footer>
  );
};

export default Footer;