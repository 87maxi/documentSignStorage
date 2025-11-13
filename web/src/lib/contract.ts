"use client"

import { useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';

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
  const [contract, setContract] = useState<Contract | null>(null);
  const [signerAddress, setSignerAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);

    useEffect(() => {
    const initializeContract = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Siempre usar Anvil como proveedor (único método de conexión)
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        // Usar la primera cuenta de Anvil por defecto
        const signer = await provider.getSigner(0);
        
        // Crear instancia del contrato
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        
        setContract(contractInstance);
        setSignerAddress(await signer.getAddress());
      } catch (err) {
        console.error('Contract initialization error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeContract();
  }, []);

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