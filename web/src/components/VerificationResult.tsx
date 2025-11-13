"use client"

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface VerificationResultProps {
  result: {
    isValid: boolean | null;
    details: {
      hash: string;
      signer: string;
      timestamp: number;
      documentName: string;
      transactionHash: string;
    } | null;
    error: string | null;
  };
  isLoading?: boolean;
}

export function VerificationResult({ 
  result: { isValid, details, error },
  isLoading = false
}: VerificationResultProps) {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (isValid === null && !error) return null;

  return (
    <div className={`card transition-all duration-300 ${
      isValid === true 
        ? 'border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/20' 
        : 'border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/20'
    }`}>    
      <div className="flex items-center space-x-3 mb-4">
        {isValid === true ? (
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        )}
        <div>
          <h3 className={`text-xl font-bold ${
            isValid === true ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
          }`}>
            {isValid === true ? 'Verification Successful' : 'Verification Failed'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isValid === true ? 'Document verified on blockchain' : 'Document could not be verified'}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-2">Error Details:</p>
          <p className="text-sm text-red-700 dark:text-red-400 break-words">{error}</p>
        </div>
      )}

      {isValid === true && details && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document Hash</p>
              <p className="text-sm font-mono text-gray-800 dark:text-gray-300 break-all">{details.hash}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Signer Address</p>
              <p className="text-sm font-mono text-gray-800 dark:text-gray-300 break-all">{details.signer}</p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document Name</p>
              <p className="text-sm text-gray-800 dark:text-gray-300">{details.documentName}</p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Signed On</p>
              <p className="text-sm text-gray-800 dark:text-gray-300">
                {new Date(details.timestamp * 1000).toLocaleString()}
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  ({formatDistanceToNow(new Date(details.timestamp * 1000))} ago)
                </span>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Transaction Details</p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-800 dark:text-gray-300">View on blockchain explorer:</span>
              <a 
                href={`https://etherscan.io/tx/${details.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                {details.transactionHash.slice(0, 10)}...{details.transactionHash.slice(-8)}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="pt-4">
            <button 
              className="btn btn-primary bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => window.location.reload()}
            >
              Verify Another Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
