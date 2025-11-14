"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { anvilAccounts } from '@/lib/anvilAccounts';

interface AnvilWallet {
  account: {
    address: string;
    label: string;
  };
  signer: ethers.Signer;
}

export function WalletSelector() {
  const [isConnected, setIsConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [anvilWallets, setAnvilWallets] = useState<AnvilWallet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAnvilWallets = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        
        // Create signer for each Anvil account
        const wallets = anvilAccounts.map(account => {
          const signer = new ethers.Wallet(account.privateKey, provider);
          return {
            account: {
              address: account.address,
              label: account.label
            },
            signer
          };
        });
        
        setAnvilWallets(wallets);
        setIsConnected(true);
        setSelectedAccount(wallets[0].account.address);
      } catch (err) {
        console.error('Failed to connect to Anvil:', err);
        setError('Failed to connect to Anvil. Make sure Anvil is running on http://127.0.0.1:8545');
        setIsConnected(false);
      }
    };

    initializeAnvilWallets();
  }, []);

  const handleAccountSelect = (address: string) => {
    setSelectedAccount(address);
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
        className={`px-3 py-1 text-xs rounded-full flex items-center space-x-2 transition-colors
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
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              Select Account
            </div>
            {anvilWallets.map((wallet) => (
              <button
                key={wallet.account.address}
                onClick={() => handleAccountSelect(wallet.account.address)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3
                  ${selectedAccount === wallet.account.address
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                  <span className="text-xs font-mono">{anvilAccounts.findIndex(acc => acc.address === wallet.account.address)}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{wallet.account.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {wallet.account.address.slice(0, 10)}...
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}