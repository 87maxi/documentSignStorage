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
      <div className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
        {selectedAccount ? 
          	selectedAccount.slice(0, 6) + '...' + selectedAccount.slice(-4) :
          'Not connected'
        }
      </div>
    </div>
  );
}