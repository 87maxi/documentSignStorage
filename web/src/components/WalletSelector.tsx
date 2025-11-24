"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { anvilAccounts } from '@/lib/anvilAccounts';
import { useWallet } from '@/contexts/walletContext';

interface AnvilWallet {
  account: {
    address: string;
    label: string;
  };
  signer: ethers.Signer;
}

export function WalletSelector() {
  const { isConnected, showDropdown, setShowDropdown, selectedAccount, anvilWallets, error } = useWallet();

  // Remove the useEffect since we're using the context
  // The wallet initialization is now handled in the WalletProvider

  const handleAccountSelect = (address: string) => {
    // This would normally dispatch to the context
    // For now we'll keep the setShowDropdown
    setShowDropdown(false);
  };

  if (error) {
    return (
      <div className="px-4 py-2 text-sm text-red-700 bg-red-100 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => isConnected && setShowDropdown(!showDropdown)}
        className={`px-3 py-1.5 text-xs rounded-lg flex items-center space-x-2 transition-colors
          ${isConnected 
            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
            : 'bg-red-100 text-red-800'}
        `}
        disabled={!isConnected}
      >
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>
          {selectedAccount ? 
            selectedAccount.slice(0, 6) + '...' + selectedAccount.slice(-4) :
            'Not connected'
          }
        </span>
        {isConnected && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isConnected && showDropdown && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              Select Account
            </div>
            {anvilWallets.map((wallet) => (
                              <button
                key={wallet.account.address}
                onClick={() => handleAccountSelect(wallet.account.address)}
                className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-3
                  ${selectedAccount === wallet.account.address
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-mono font-bold text-blue-700 dark:text-blue-300">{anvilAccounts.findIndex(acc => acc.address === wallet.account.address)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">{wallet.account.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {wallet.account.address}
                  </div>
                </div>
                {selectedAccount === wallet.account.address && (
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}