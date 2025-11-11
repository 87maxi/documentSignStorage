import { BrowserProvider, JsonRpcSigner, Contract, ethers } from 'ethers'
import { debug } from '@/utils/debug'

// DocumentVerification Contract ABI
export const DOCUMENT_VERIFICATION_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_signer",
        "type": "address"
      }
    ],
    "name": "storeDocumentHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_signer",
        "type": "address"
      }
    ],
    "name": "verifyDocument",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "signer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      }
    ],
    "name": "getDocumentInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "signer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      }
    ],
    "name": "hasDocument",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const DOCUMENT_VERIFICATION_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string

// Ethereum provider and signer utilities
export class EthereumService {
  private static provider: BrowserProvider | null = null
  private static signer: JsonRpcSigner | null = null

  static async connectWallet(): Promise<string> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask no está instalado')
      }

      this.provider = new BrowserProvider(window.ethereum)
      
      // Request account access
      const accounts = await this.provider.send('eth_requestAccounts', [])
      
      this.signer = await this.provider.getSigner()
      
      const address = await this.signer.getAddress()
      debug.wallet.connection(address, await this.getChainId())
      
      return address
    } catch (error) {
      debug.log.error('connectWallet error:', error)
      throw error
    }
  }

  static async disconnectWallet(): Promise<void> {
    this.provider = null
    this.signer = null
    debug.wallet.disconnection()
  }

  static async getAddress(): Promise<string | null> {
    if (!this.signer) return null
    return this.signer.getAddress()
  }

  static async getChainId(): Promise<number> {
    if (!this.provider) return 0
    const network = await this.provider.getNetwork()
    return Number(network.chainId)
  }

  static async isConnected(): Promise<boolean> {
    return this.signer !== null
  }

  static getContract(): Contract {
    if (!this.signer) {
      throw new Error('Wallet no conectada')
    }
    
    return new Contract(
      DOCUMENT_VERIFICATION_ADDRESS,
      DOCUMENT_VERIFICATION_ABI,
      this.signer
    )
  }

  static getReadOnlyContract(): Contract {
    if (!this.provider) {
      throw new Error('Provider no disponible')
    }
    
    return new Contract(
      DOCUMENT_VERIFICATION_ADDRESS,
      DOCUMENT_VERIFICATION_ABI,
      this.provider
    )
  }

  // Listen for account changes
  static setupEventListeners(onAccountsChanged: (accounts: string[]) => void) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', onAccountsChanged)
      
      window.ethereum.on('chainChanged', (chainId: string) => {
        const chainIdNum = parseInt(chainId, 16)
        debug.wallet.chainChange(chainIdNum)
        window.location.reload()
      })
    }
  }

  // Remove event listeners
  static removeEventListeners() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged')
      window.ethereum.removeAllListeners('chainChanged')
    }
  }
}

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}