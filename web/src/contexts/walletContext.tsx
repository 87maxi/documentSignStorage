"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { supportedChains, Chain, getChainById } from '@/lib/chains';

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
  currentChain: Chain | null;
  switchChain: (chainId: number) => Promise<void>;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

// Mnemonic por defecto de Anvil (genera las mismas cuentas que tienes en anvilAccounts.ts)
const DEFAULT_MNEMONIC = "test test test test test test test test test test test junk";

// Default RPC URL for local Anvil instance
const DEFAULT_RPC_URL = "http://127.0.0.1:8545";

// WalletProvider component
export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [anvilWallets, setAnvilWallets] = useState<AnvilWallet[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletProvider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [currentChain, setCurrentChain] = useState<Chain | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const connection = async () => {
      try {
        console.log('🔌 Connecting to Anvil at http://127.0.0.1:8545...');
        
        // Create provider for Anvil with shorter timeout for debugging
        const localChain = supportedChains.find(chain => chain.id === 31337) || supportedChains[0];
        const rpcProvider = new ethers.JsonRpcProvider(DEFAULT_RPC_URL, localChain.id, {
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
        ]) as ethers.Network;
        
        console.log('✅ Connected to network:', network.name, 'Chain ID:', network.chainId);
        
        // Set current chain
        const chainData = getChainById(Number(network.chainId));
        if (chainData) {
          setCurrentChain(chainData);
        } else {
          // Handle unknown chain
          console.warn('Unknown chain:', network.chainId, network.name);
          setCurrentChain({
            id: Number(network.chainId),
            name: network.name,
            rpcUrl: DEFAULT_RPC_URL,
            currency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
          });
        }
        
        // Crear wallet desde el mnemonic de Anvil
        console.log('🔑 Generating wallets from mnemonic...');
        
        // Generar las primeras 10 cuentas desde el mnemonic (HD wallet)
        const wallets: AnvilWallet[] = [];
        
        for (let i = 0; i < 10; i++) {
          const derivedWallet = ethers.HDNodeWallet.fromPhrase(DEFAULT_MNEMONIC, undefined, `m/44'/60'/0'/0/${i}`);
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
      }, [anvilWallets, selectedAccount, isConnected, error, walletProvider, currentChain]);

  // Function to switch chains
  const switchChain = async (chainId: number): Promise<void> => {
    try {
      console.log('🔄 Attempting to switch to chain:', chainId);
      
      const chain = getChainById(chainId);
      if (!chain) {
        throw new Error(`Chain with id ${chainId} is not supported`);
      }
      
      // For now, we'll only support switching to local Anvil for development
      if (chainId !== 31337) {
        throw new Error(`Chain switching to ${chain.name} is not yet implemented. Please use Anvil (31337).`);
      }
      
      // In a real implementation, this would use wallet extension APIs like:
      // await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x' + chainId.toString(16) }] });
      
      // For now, we'll just show a message and reload
      alert(`Chain switch to ${chain.name} would normally be handled by your wallet.\nFor development, please ensure Anvil is running on port 8545.`);
      window.location.reload();
    } catch (error) {
      console.error('❌ Failed to switch chain:', error);
      throw error;
    }
  };

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
    walletProvider,
    currentChain,
    switchChain,
    showDropdown,
    setShowDropdown
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
