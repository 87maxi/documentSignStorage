"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface AnvilWallet {
  account: {
    address: string;
    label: string;
  };
  signer: ethers.Signer;
  address: string;
}

interface WalletContextType {
  anvilWallets: AnvilWallet[];
  selectedAccount: string | null;
  setSelectedAccount: (address: string) => void;
  isConnected: boolean;
  error: string | null;
  walletProvider: ethers.JsonRpcProvider | null;
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

// Mnemonic por defecto de Anvil (genera las mismas cuentas que tienes en anvilAccounts.ts)
const ANVIL_MNEMONIC = "test test test test test test test test test test test junk";

// WalletProvider component
export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [anvilWallets, setAnvilWallets] = useState<AnvilWallet[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletProvider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);

  useEffect(() => {
    const connection = async () => {
      try {
        console.log('🔌 Connecting to Anvil at http://127.0.0.1:8545...');
        
        // Crear provider para Anvil con timeout más corto para debugging
        const rpcProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", undefined, {
          polling: false,
          staticNetwork: true
        });
        
        // Verificar conexión con Anvil con timeout
        console.log('⏳ Checking network connection...');
        const network = await Promise.race([
          rpcProvider.getNetwork(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
          )
        ]);
        
        console.log('✅ Connected to network:', network.name, 'Chain ID:', network.chainId);
        
        // Crear wallet desde el mnemonic de Anvil
        console.log('🔑 Generating wallets from mnemonic...');
        
        // Generar las primeras 10 cuentas desde el mnemonic (HD wallet)
        const wallets: AnvilWallet[] = [];
        
        for (let i = 0; i < 10; i++) {
          const derivedWallet = ethers.HDNodeWallet.fromPhrase(ANVIL_MNEMONIC, undefined, `m/44'/60'/0'/0/${i}`);
          const signer = new ethers.Wallet(derivedWallet.privateKey, rpcProvider);
          
          wallets.push({
            account: {
              address: derivedWallet.address,
              label: `anvil-key-${i}`
            },
            signer,
            address: derivedWallet.address
          });
        }
        
        console.log('✅ Generated', wallets.length, 'wallets');
        
        setAnvilWallets(wallets);
        setProvider(rpcProvider);
        setIsConnected(true);
        setError(null);
        
        // Establecer la primera cuenta como seleccionada
        if (wallets.length > 0) {
          setSelectedAccount(wallets[0].account.address);
          console.log('📌 Default selected account:', wallets[0].account.address);
        }
          
      } catch (err) {
        console.error('❌ Failed to connect to Anvil:', err);
        const errorMessage = 'Failed to connect to Anvil. Make sure Anvil is running on http://127.0.0.1:8545. Error: ' + (err instanceof Error ? err.message : 'Unknown error');
        setError(errorMessage);
        setIsConnected(false);
        setAnvilWallets([]);
        setSelectedAccount(null);
        setProvider(null);
      }
    }

    connection();
  }, []); 

  // Log del estado actual para debugging
  useEffect(() => {
    console.log('📊 WalletContext State:', {
      anvilWallets: anvilWallets.length,
      selectedAccount,
      isConnected,
      error,
      hasProvider: !!walletProvider
    });
    
    // Log detallado de las wallets cuando estén disponibles
    if (anvilWallets.length > 0) {
      console.log('💰 Available wallets:', anvilWallets.map(w => ({
        label: w.account.label,
        address: w.address,
        selected: w.address === selectedAccount
      })));
    }
  }, [anvilWallets, selectedAccount, isConnected, error, walletProvider]);

  // Debug: log cuando setSelectedAccount es llamado
  const debugSetSelectedAccount = (address: string) => {
    console.log('🎯 setSelectedAccount called with:', address);
    setSelectedAccount(address);
  };

  return (
    <WalletContext.Provider value={{ 
      anvilWallets, 
      selectedAccount, 
      setSelectedAccount: debugSetSelectedAccount, 
      isConnected, 
      error, 
      walletProvider 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook to use the context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
