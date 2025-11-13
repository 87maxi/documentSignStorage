"use client"

import React, { useState } from 'react';

interface SignerAddressInputProps {
  value: string;
  onChange: (address: string) => void;
}

export function SignerAddressInput({ value, onChange }: SignerAddressInputProps) {
  const [ensInput, setEnsInput] = useState<string>("");
  const [isResolving, setIsResolving] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onChange(input);
  };

  const resolveEns = async () => {
    // Mock ENS resolution for demo purposes
    setIsResolving(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock resolution for demo
    if (ensInput === "document.sign.eth") {
      onChange("0x742d35Cc6634C0532925a3b8D4Ccb8cBbA96c9C5");
    } else if (ensInput.endsWith(".eth")) {
      // Generate a mock address based on ENS name
      const mockAddress = "0x" + ensInput.slice(0, -4).split("").reduce((acc, char) => {
        const charCode = char.charCodeAt(0).toString(16);
        return acc + charCode.padStart(2, '0');
      }, "").padEnd(40, "1");
      onChange(mockAddress);
    }
    
    setIsResolving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Signer Verification</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="signer-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Signer Address
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              id="signer-address"
              value={value}
              onChange={handleInputChange}
              placeholder="0x... or ens.name.eth"
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={resolveEns}
              disabled={isResolving || !ensInput || !ensInput.includes(".")}
              className="btn btn-secondary px-4 whitespace-nowrap transition-all"
            >
              {isResolving ? (
                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span>Resolve</span>
              )}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter the blockchain address of the document signer or ENS name.
          </p>
        </div>
        
        {value && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm transition-all ${
            /^0x[a-fA-F0-9]{40}$/.test(value)
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
          }`}>
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/^0x[a-fA-F0-9]{40}$/.test(value) ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              )}
            </svg>
            <span>
              {/^0x[a-fA-F0-9]{40}$/.test(value) 
                ? `Valid Ethereum address` 
                : `Invalid address format`
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
}