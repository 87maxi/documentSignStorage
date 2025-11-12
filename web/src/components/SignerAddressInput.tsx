"use client";

import React, { useState, useEffect } from "react";

interface SignerAddressInputProps {
  onAddressResolved: (address: string) => void;
}

const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const resolveENS = async (ensName: string): Promise<string | null> => {
  // Mock ENS resolution - in production, this would use ethers.js
  if (ensName === 'test.eth') {
    return '0x742d35Cc6634C0532925a3b8D4C98aBd7788142C';
  }
  return null;
};

const SignerAddressInput: React.FC<SignerAddressInputProps> = ({ onAddressResolved }) => {
  const [inputValue, setInputValue] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const addressHistory = [
    '0x742d35Cc6634C0532925a3b8D4C98aBd7788142C',
    '0x1234567890123456789012345678901234567890',
  ];

  useEffect(() => {
    if (resolvedAddress) {
      onAddressResolved(resolvedAddress);
    }
  }, [resolvedAddress, onAddressResolved]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setResolvedAddress(null);
    setError(null);
    
    if (value === '') {
      setResolvedAddress(null);
    }
  };

  const validateAndResolve = async () => {
    if (!inputValue.trim()) {
      setError('Address is required');
      setResolvedAddress(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Check if it's already a valid address
    if (isValidEthereumAddress(inputValue)) {
      setResolvedAddress(inputValue);
      setIsLoading(false);
      return;
    }

    // Try to resolve as ENS
    try {
      const resolved = await resolveENS(inputValue);
      if (resolved) {
        setResolvedAddress(resolved);
      } else {
        setError('Invalid Ethereum address or ENS name');
        setResolvedAddress(null);
      }
    } catch (err) {
      setError('Failed to resolve ENS name');
      setResolvedAddress(null);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const useAddressFromHistory = (address: string) => {
    setInputValue(address);
    setResolvedAddress(address);
    setError(null);
    setShowHistory(false);
  };

  const clearInput = () => {
    setInputValue('');
    setResolvedAddress(null);
    setError(null);
    setShowHistory(false);
  };

  return (
    <div className="space-y-4">
      <label htmlFor="signerAddress" className="block text-sm font-medium text-gray-700">
        Signer Address
      </label>
      
      <div className="relative">
        <input
          type="text"
          id="signerAddress"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowHistory(true)}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          placeholder="Enter Ethereum address or ENS name"
          className={`block w-full rounded-lg border-2 px-4 py-3 pr-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
            ${error ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
            ${resolvedAddress ? 'border-green-300 bg-green-50' : ''}`}
        />
        
        {inputValue && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        )}

        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {showHistory && !inputValue && addressHistory.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-48 overflow-auto">
          <div className="py-2">
            <p className="px-4 py-1 text-xs font-medium text-gray-500 bg-gray-50">Recent addresses</p>
            {addressHistory.map((address) => (
              <button
                key={address}
                type="button"
                onClick={() => useAddressFromHistory(address)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={validateAndResolve}
          disabled={isLoading || !inputValue.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Resolving...' : 'Resolve Address'}
        </button>
        
        {error && <p className="text-sm text-red-600">{error}</p>}
        {resolvedAddress && !error && (
          <p className="text-sm text-green-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified: {resolvedAddress.slice(0, 6)}...{resolvedAddress.slice(-4)}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignerAddressInput;