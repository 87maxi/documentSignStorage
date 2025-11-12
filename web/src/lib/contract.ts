import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { createTestClient } from 'wagmi';
// import {  } from  "wagmi.ts"


// Get contract address from environment variable
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Temporary mock ABI - replace with actual contract ABI
const mockABI = [
  {
    "inputs": [
      {"internalType": "bytes32", "name": "hash", "type": "bytes32"},
      {"internalType": "address", "name": "expectedSigner", "type": "address"}
    ],
    "name": "verifyDocument",
    "outputs": [
      {"internalType": "bool", "name": "isValid", "type": "bool"},
      {"internalType": "address", "name": "signer", "type": "address"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "blockNumber", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

class DocumentVerificationContract {
  private client;

  constructor() {
    // Initialize the client with a default configuration
    this.client = createPublicClient({
      chain: mainnet,
      transport: http('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
    });
  }

  // Get contract address (useful for debugging)
  getContractAddress(): string {
    return CONTRACT_ADDRESS;
  }

  async storeDocumentHash(hash: string, signer: string) {
    // This would require a wallet client for writing
    console.log('storeDocumentHash', hash, signer);
  }

  async verifyDocument(hash: string, expectedSigner: string) {
    if (!hash || !expectedSigner) {
      return {
        isValid: false,
        signer: '',
        timestamp: 0,
        blockNumber: 0
      };
    }
    
    try {
      // Ensure hash is properly formatted
      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      
      const result = await this.client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: mockABI,
        functionName: 'verifyDocument',
        args: [formattedHash, expectedSigner]
      });
      
      return {
        isValid: result[0],
        signer: result[1],
        timestamp: result[2],
        blockNumber: result[3]
      };
    } catch (error) {
      console.error('Error verifying document:', error);
      return {
        isValid: false,
        signer: '',
        timestamp: 0,
        blockNumber: 0
      };
    }
  }

  async getDocumentInfo(hash: string) {
    if (!hash) {
      return {
        signer: '',
        timestamp: 0,
        blockNumber: 0,
        isValid: false
      };
    }
    
    try {
      // Ensure hash is properly formatted
      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      
      const result = await this.client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: mockABI,
        functionName: 'getDocumentInfo',
        args: [formattedHash]
      });
      
      return {
        signer: result[0],
        timestamp: result[1],
        blockNumber: result[2],
        isValid: result[3]
      };
    } catch (error) {
      console.error('Error getting document info:', error);
      return {
        signer: '',
        timestamp: 0,
        blockNumber: 0,
        isValid: false
      };
    }
  }

  async hasDocument(user: string, hash: string) {
    if (!user || !hash) {
      return false;
    }
    
    try {
      // Ensure hash is properly formatted
      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      
      const result = await this.client.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: mockABI,
        functionName: 'hasDocument',
        args: [user, formattedHash]
      });
      return result;
    } catch (error) {
      console.error('Error checking document ownership:', error);
      return false;
    }
  }
}

export default DocumentVerificationContract;
