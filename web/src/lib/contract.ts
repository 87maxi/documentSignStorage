"use client"

import { useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import { useWallet } from '@/contexts/walletContext';
import DocumentRegistry from '@/lib/contracts/abis/DocumentRegistry.json';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

interface ContractDocumentInfo {
  hash: string;
  timestamp: number;
  signer: string;
  exists: boolean;
}

export const useContract = () => {
  const { anvilWallets, selectedAccount, walletProvider, isConnected } = useWallet();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [signerAddress, setSignerAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [blockHash, setBlockHash] = useState<string>("");

  useEffect(() => {
    const initializeContract = async () => {
      try {
        setError(null);
        setIsLoading(true);

        // Debug logs
        console.log('🔧 Initializing contract...');
        console.log('isConnected:', isConnected);
        console.log('walletProvider:', !!walletProvider);
        console.log('selectedAccount:', selectedAccount);
        console.log('anvilWallets count:', anvilWallets?.length);
        console.log('ABI loaded:', !!DocumentRegistry);
        console.log(DocumentRegistry)

        if (!isConnected || !walletProvider || !selectedAccount || !anvilWallets?.length) {
          console.log('❌ Missing required dependencies');
          setContract(null);
          setSignerAddress("");
          setIsLoading(false);
          return;
        }

        const selectedWallet = anvilWallets.find(
          wallet => wallet.account.address.toLowerCase() === selectedAccount.toLowerCase()
        );
        
        if (!selectedWallet) {
          throw new Error(`Wallet no encontrado para la dirección ${selectedAccount}`);
        }

        console.log('✅ Selected wallet found:', selectedWallet.account.address);
        console.log('✅ Signer available:', !!selectedWallet.signer);

        // Crear instancia del contrato
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          DocumentRegistry,
          selectedWallet.signer
        );

        // Test básico del contrato
        try {
          const code = await walletProvider.getCode(CONTRACT_ADDRESS);
          console.log('📄 Contract code length:', code.length);
          
          if (code === '0x') {
            throw new Error('Contract not deployed at address');
          }
        } catch (testError) {
          console.error('❌ Contract test failed:', testError);
          throw new Error(`Contract not available: ${testError}`);
        }
        
        setContract(contractInstance);
        setSignerAddress(selectedAccount);
        console.log('✅ Contract initialized successfully');
        
      } catch (err) {
        console.error('❌ Contract initialization error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setContract(null);
        setSignerAddress("");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeContract();
  }, [isConnected, walletProvider, selectedAccount, anvilWallets]);

  const storeDocumentHash = async (hash: string, timestamp: number, signature: string): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      console.log('📝 Storing document hash:', { hash, timestamp, signature });
      const tx = await contract.storeDocumentHash(hash, timestamp, signature);
      console.log('⏳ Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      setBlockHash(receipt.blockHash)
      console.log('✅ Transaction confirmed:', receipt);
      return true;
    } catch (err) {
      console.error('❌ Error storing document hash:', err);
      throw err;
    }
  };

  const getDocumentInfo = async (hash: string): Promise<ContractDocumentInfo | null> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      console.log('🔍 Getting document info for hash:', hash);
      const info = await contract.getDocumentInfo(hash);
      console.log('📄 Document info received:', info);
      
      return {
        hash: info.hash,
        timestamp: Number(info.timestamp),
        signer: info.signer,
        exists: info.exists
      };
    } catch (err) {
      console.error('❌ Error getting document info:', err);
      return null;
    }
  };

  const verifyDocument = async (hash: string, signer: string, signature: string): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      console.log('🔎 Verifying document:', { hash, signer, signature });
      const isValid = await contract.verifyDocument(hash, signer, signature);
      console.log('✅ Document verification result:', isValid);
      return isValid;
    } catch (err) {
      console.error('❌ Error verifying document:', err);
      return false;
    }
  };

  const hasDocument = async (user: string, hash: string): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const hasDoc = await contract.hasDocument(user, hash);
      console.log('📋 Has document result:', { user, hash, hasDoc });
      return hasDoc;
    } catch (err) {
      console.error('❌ Error checking if user has document:', err);
      return false;
    }
  };

  const getSignerAddress = (): string => {
    if (!signerAddress) throw new Error('Signer not available');
    return signerAddress;
  };

  return {
    blockHash,
    contract,
    signerAddress,
    isLoading,
    error,
    storeDocumentHash,
    getDocumentInfo,
    verifyDocument,
    hasDocument,
    getSignerAddress,
  };
};