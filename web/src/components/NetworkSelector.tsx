"use client"

import React, { useState } from 'react';
import { useWallet } from '@/contexts/walletContext';
import { supportedChains, Chain } from '@/lib/chains';

interface NetworkSelectorProps {
  className?: string;
}

export function NetworkSelector({ className = '' }: NetworkSelectorProps) {
  const { currentChain, switchChain, isConnected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);

  const handleChainSelect = async (chain: Chain) => {
    try {
      await switchChain(chain.id);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch network:', error);
      // Error is handled in switchChain function
    }
  };

  // Only show if connected
  if (!isConnected) return null;

  return (
    <div className={className}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 dark:bg-blue-500/10 hover:dark:bg-blue-500/20 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          type="button"
        >
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>{currentChain?.name || 'Unknown Network'}</span>
          </div>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="py-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                Select Network
              </div>
              <div className="max-h-60 overflow-y-auto">
                {supportedChains.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleChainSelect(chain)}
                    disabled={chain.id === currentChain?.id}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-3 transition-colors
                      ${
                        chain.id === currentChain?.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                      ${chain.id !== 31337 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      chain.id === currentChain?.id ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{chain.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {chain.currency.symbol}
                        {chain.id !== 31337 && ' (Coming soon)'}
                      </div>
                    </div>
                    {chain.id === currentChain?.id && (
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                Mainnet and testnets coming soon
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}