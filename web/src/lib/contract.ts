"use client"

import { useContext, useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import { useWallet } from '@/contexts/walletContext'; // Adjusted import path

// Replace with your actual contract address and ABI
const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Deployed contract address from Anvil

// ABI completo para Document Registry contract
const CONTRACT_ABI = [
  "function storeDocumentHash(bytes32 hash, uint256 timestamp, bytes memory signature) external",
  "function verifyDocument(bytes32 hash, address signer, bytes memory signature) external view returns (bool)",
  "function getDocumentInfo(bytes32 hash) external view returns (bytes32 hash, uint256 timestamp, address signer, bool exists)",
  "function hasDocument(address user, bytes32 hash) external view returns (bool)"
];

interface ContractDocumentInfo {
  hash: string;
  timestamp: number;
  signer: string;
  exists: boolean;
}

export const useContract = () => {
  // Llamar useWallet PRIMERO - en el nivel superior
  const { anvilWallets, selectedAccount, walletProvider, isConnected, error: walletError } = useWallet();
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [signerAddress, setSignerAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);

  useEffect(() => {
    const initializeContract = async () => {
      try {
        // Verificar si tenemos todos los elementos necesarios
        if (!isConnected || !walletProvider || !selectedAccount || anvilWallets.length === 0) {
          setContract(null);
          setSignerAddress("");
          setProvider(null);
          setIsLoading(false);
          return;
        }

        // Encontrar el wallet seleccionado
        const selectedWallet = anvilWallets.find(
          wallet => wallet.account.address.toLowerCase() === selectedAccount.toLowerCase()
        );
        
        if (!selectedWallet) {
          throw new Error(`Wallet no encontrado para la dirección ${selectedAccount}`);
        }
        
        // Crear instancia del contrato con el signer seleccionado
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          selectedWallet.signer
        );
        
        setContract(contractInstance);
        setSignerAddress(selectedAccount);
        setProvider(walletProvider);
        setError(null);
        
      } catch (err) {
        console.error('Contract initialization error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setContract(null);
        setSignerAddress("");
        setProvider(walletProvider);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeContract();
    
    // Cleanup function
    return () => {
      setContract(null);
      setSignerAddress("");
      setProvider(null);
      setError(null);
    };
  }, [isConnected, walletProvider, selectedAccount, anvilWallets, walletError]);

  const storeDocumentHash = async (hash: string, timestamp: number, signature: string): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const tx = await contract.storeDocumentHash(hash, timestamp, signature);
      await tx.wait();
      return true;
    } catch (err) {
      console.error('Error storing document hash:', err);
      throw err;
    }
  };

  const getDocumentInfo = async (hash: string): Promise<ContractDocumentInfo | null> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const info = await contract.getDocumentInfo(hash);
      return {
        hash: info.hash,
        timestamp: Number(info.timestamp),
        signer: info.signer,
        exists: info.exists
      };
    } catch (err) {
      console.error('Error getting document info:', err);
      return null;
    }
  };

  const verifyDocument = async (hash: string, signer: string, signature: string): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      return await contract.verifyDocument(hash, signer, signature);
    } catch (err) {
      console.error('Error verifying document:', err);
      return false;
    }
  };

  const hasDocument = async (user: string, hash: string): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      return await contract.hasDocument(user, hash);
    } catch (err) {
      console.error('Error checking if user has document:', err);
      return false;
    }
  };

  const getSignerAddress = async (): Promise<string> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      return await contract.signer();
    } catch (err) {
      console.error('Error getting signer address:', err);
      throw err;
    }
  };

  return {
    contract,
    signerAddress,
    isLoading,
    error,
    storeDocumentHash,
    getDocumentInfo,
    verifyDocument,
    hasDocument,
    getSignerAddress,
    provider
  };
};