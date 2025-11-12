"use client";

import React from "react";

interface VerificationResult {
  success: boolean;
  hash: string;
  signer: string;
  verified: boolean;
  signatureValid: boolean;
  blockNumber?: number;
  timestamp?: number;
  transactionHash?: string;
  message?: string;
}

interface VerificationResultProps {
  result: VerificationResult | null;
}

const VerificationResult: React.FC<VerificationResultProps> = ({ result }) => {
  if (!result) {
    return null;
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusColor = () => {
    if (!result.verified) return 'text-red-800 bg-red-100';
    if (!result.signatureValid) return 'text-yellow-800 bg-yellow-100';
    return 'text-green-800 bg-green-100';
  };

  const getStatusText = () => {
    if (!result.verified) return 'NOT VERIFIED';
    if (!result.signatureValid) return 'SIGNATURE INVALID';
    return 'VERIFIED';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Verification Result</h3>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </div>
          {result.success && (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )}
          {!result.success && (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
        </div>

        {result.message && (
          <p className="text-sm text-gray-600 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            {result.message}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Document Hash</h4>
            <p className="text-sm text-gray-900 font-mono break-all">{result.hash}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">Signer Address</h4>
            <p className="text-sm text-gray-900 font-mono">{result.signer}</p>
          </div>

          {result.blockNumber && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Block Number</h4>
              <p className="text-sm text-gray-900">{result.blockNumber.toLocaleString()}</p>
            </div>
          )}

          {result.timestamp && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Timestamp</h4>
              <p className="text-sm text-gray-900">{formatDate(result.timestamp)}</p>
            </div>
          )}
        </div>

        {result.transactionHash && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Details</h4>
            <a 
              href={`https://etherscan.io/tx/${result.transactionHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline flex items-center"
            >
              View on Etherscan
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationResult;