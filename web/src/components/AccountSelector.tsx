


import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@/contexts/walletContext';


export const AccountSelector: React.FC = () => {
  const { anvilWallets, selectedAccount, setSelectedAccount, isConnected, error } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (address: string) => {
    setSelectedAccount(address);
    setIsOpen(false);
  };

  const selectedWallet = anvilWallets.find(w => w.address === selectedAccount);

  if (error) {
    return (
      <div className="px-3 py-1 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 rounded-full">
        Error: {error}
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="px-3 py-1 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 rounded-full">
        Connecting to Anvil...
      </div>
    );
  }

  if (!anvilWallets.length) {
    return (
      <div className="px-3 py-1 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 rounded-full">
        No accounts available
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Account:
        </label>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between min-w-[200px] border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800  dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <span>
            {selectedWallet
              ? `${selectedWallet.account.label} - ${selectedWallet.address.slice(0, 6)}...${selectedWallet.address.slice(-4)}`
              : 'Select an account'
            }
          </span>
          <svg
            className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {selectedAccount && (
          <span className="text-xs text-green-600 dark:text-green-400 whitespace-nowrap">
            ✓ Connected
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {anvilWallets.map((wallet) => (
            <button
              key={wallet.address}
              onClick={() => handleSelect(wallet.address)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                wallet.address === selectedAccount
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                  : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`} >
              <div className="flex items-center space-x-2">
                {wallet.address === selectedAccount && (
                  <svg className="h-4 w-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{wallet.account.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                  </div>
                </div>
                <button onClick={(e) => {
                          e.stopPropagation(); // Prevent dropdown from closing
                          navigator.clipboard.writeText(wallet.address);
                        }} className="ml-auto p-1 rounded hover:bg-gray-600 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-300 hover:text-white transition-colors" title="Copy address">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
