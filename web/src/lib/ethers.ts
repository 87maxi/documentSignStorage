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
      // Verificación exhaustiva de MetaMask
      if (typeof window === 'undefined') {
        throw new Error('Entorno de navegador no disponible')
      }
      
      if (!window.ethereum) {
        // Verificar si es mobile con wallet apps
        if (window.ethereum?.isMetaMask) {
          throw new Error('MetaMask no está disponible. Verifica que la extensión esté instalada y activa.')
        }
        throw new Error(
          'MetaMask no detectado. ' +
          'Por favor, instala MetaMask desde https://metamask.io/ ' +
          'o usa un navegador con MetaMask instalado.'
        )
      }

      // Verificar si MetaMask está desbloqueado
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts',
          params: []
        })
        
        // Si ya hay cuentas conectadas, usarlas
        if (accounts && accounts.length > 0) {
          this.provider = new BrowserProvider(window.ethereum)
          this.signer = await this.provider.getSigner()
          const address = await this.signer.getAddress()
          debug.wallet.connection(address, await this.getChainId())
          return address
        }
      } catch (accountsError) {
        debug.log.debug('eth_accounts failed, proceeding to request accounts:', accountsError)
      }

      // Solicitar conexión explícita - permitir selección de cuenta
      try {
        // Primero verificar cuáles cuentas están disponibles
        const availableAccounts = await window.ethereum.request({
          method: 'eth_accounts',
          params: []
        })
        
        // Si hay múltiples cuentas, forzar la selección
        if (availableAccounts && availableAccounts.length > 1) {
          // Cerrar cualquier conexión existente para forzar selección
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          }).catch(() => {
            // Si falla, continuar con eth_requestAccounts normal
          })
        }

        // Solicitar conexión estándar
        const requestedAccounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
          params: []
        })
        
        if (!requestedAccounts || requestedAccounts.length === 0) {
          throw new Error('MetaMask no devolvió ninguna cuenta. Por favor, asegúrate de tener una cuenta desbloqueada.')
        }

        this.provider = new BrowserProvider(window.ethereum)
        this.signer = await this.provider.getSigner()
        
        const address = await this.signer.getAddress()
        debug.wallet.connection(address, await this.getChainId())
        
        // Verificar si el usuario tiene múltiples cuentas y mostrar advertencia
        if (availableAccounts && availableAccounts.length > 1) {
          debug.log.info(`Usuario conectado con cuenta ${address} de ${availableAccounts.length} disponibles`)
        }
        
        return address
        
      } catch (requestError: any) {
        debug.log.error('eth_requestAccounts error:', requestError)
        
        if (requestError.code === 4001) {
          throw new Error('Conexión rechazada. Por favor, acepta la solicitud de conexión en MetaMask para continuar.')
        }
        
        if (requestError.message?.includes('Not connected')) {
          throw new Error(
            'MetaMask reporta "Not connected". ' +
            'Por favor, verifica que MetaMask esté desbloqueado y ' +
            'reload la página para intentar nuevamente.'
          )
        }
        
        throw new Error(`Error al conectar con MetaMask: ${requestError.message || 'Error desconocido'}`)
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? 
        error.message : 
        'Error desconocido al conectar con MetaMask'
      
      debug.log.error('connectWallet final error:', error)
      throw new Error(errorMessage)
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
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        return false
      }

      try {
        // Intentar verificar cuentas de manera segura
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts',
          params: []
        })
        
        // Si hay cuentas, verificar permisos si es posible
        if (accounts && accounts.length > 0) {
          try {
            const permissions = await window.ethereum.request({
              method: 'wallet_getPermissions'
            })
            return Array.isArray(permissions) && 
                   permissions.some((p: any) => p.parentCapability === 'eth_accounts')
          } catch {
            // Fallback: si no se pueden obtener permisos, confiar en las cuentas
            return true
          }
        }
        
        return false
        
      } catch (error) {
        debug.log.debug('isConnected check failed:', error)
        return false
      }
      
    } catch (error) {
      debug.log.error('Error in isConnected:', error)
      return false
    }
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