'use client'

import { useState, useEffect } from 'react'
import { EthereumService } from '@/lib/ethers'
import { debug } from '@/utils/debug'

export default function Header() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check initial connection
    const checkConnection = async () => {
      try {
        const connected = await EthereumService.isConnected()
        if (connected) {
          const currentAddress = await EthereumService.getAddress()
          setAddress(currentAddress)
          setIsConnected(true)
        }
      } catch (error) {
        debug.log.error('Error checking connection:', error)
      }
    }

    checkConnection()

    // Setup event listeners
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        setAddress(null)
        setIsConnected(false)
        debug.wallet.disconnection()
      } else {
        // Account changed
        setAddress(accounts[0])
        debug.wallet.accountChange(accounts[0])
      }
    }

    EthereumService.setupEventListeners(handleAccountsChanged)

    // Cleanup
    return () => {
      EthereumService.removeEventListeners()
    }
  }, [])

  const handleConnect = async () => {
    try {
      debug.log.info('Connecting to MetaMask...')
      const connectedAddress = await EthereumService.connectWallet()
      setAddress(connectedAddress)
      setIsConnected(true)
      debug.log.info('Wallet connected successfully')
    } catch (error) {
      debug.log.error('Connection failed:', error)
      alert(error instanceof Error ? error.message : 'Error connecting to MetaMask')
    }
  }

  const handleDisconnect = async () => {
    try {
      await EthereumService.disconnectWallet()
      setAddress(null)
      setIsConnected(false)
      debug.log.info('Wallet disconnected')
    } catch (error) {
      debug.log.error('Disconnection error:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                📄 Document Verification DApp
              </h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <span className="text-sm text-gray-500">
                Decentralized document verification system
              </span>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center">
            {isConnected && address ? (
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Connected Address - Hidden on mobile */}
                <div className="hidden sm:block text-sm text-gray-600">
                  Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                
                {/* Mobile badge */}
                <div className="sm:hidden">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                
                {/* Disconnect Button */}
                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <span className="hidden sm:inline">Disconnect</span>
                  <span className="sm:hidden">✗</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">🔗 Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}