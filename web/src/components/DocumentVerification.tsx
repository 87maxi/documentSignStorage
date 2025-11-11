'use client'

import { useState, useEffect } from 'react'
import { EthereumService } from '@/lib/ethers'
import FileSelector from './FileSelector'
import SignerAddressInput from './SignerAddressInput'
import VerificationResult from './VerificationResult'
import { useStoreDocument, useVerifyDocument } from '@/hooks/useDocumentVerification'
import { debug } from '@/utils/debug'

export default function DocumentVerification() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileHash, setFileHash] = useState<string>('')
  const [signerAddress, setSignerAddress] = useState<string>('')
  const [verificationStarted, setVerificationStarted] = useState(false)

  const { storeDocument, isConfirming, isConfirmed } = useStoreDocument()
  const { result, isLoading: isVerifying, refetch } = useVerifyDocument(
    fileHash as `0x${string}`,
    signerAddress as `0x${string}`
  )

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await EthereumService.isConnected()
        setIsConnected(connected)
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  const handleFileSelect = (file: File, hash: string) => {
    debug.file.selection(file)
    setSelectedFile(file)
    setFileHash(hash)
    setVerificationStarted(false)
    debug.log.debug('File selected and hash set', { filename: file.name, hash })
  }

  const handleAddressChange = (address: string) => {
    debug.log.debug('Signer address changed', { address })
    setSignerAddress(address)
    setVerificationStarted(false)
  }

  const handleStoreDocument = async () => {
    if (!fileHash || !signerAddress) return
    
    debug.contract.methodCall('storeDocumentHash', [fileHash, signerAddress])
    
    try {
      const result = await storeDocument(fileHash as `0x${string}`, signerAddress as `0x${string}`)
      if (result?.hash) {
        debug.contract.transaction(result.hash, 'storeDocumentHash')
      }
    } catch (error) {
      debug.contract.error('storeDocumentHash', error)
      console.error('Error storing document:', error)
    }
  }

  const handleVerifyDocument = async () => {
    if (!fileHash || !signerAddress) return
    
    debug.log.debug('Initiating document verification', { fileHash, signerAddress })
    setVerificationStarted(true)
    
    try {
      await refetch()
      debug.log.debug('Document verification completed', { result })
    } catch (error) {
      debug.log.error('Document verification failed:', error)
    }
  }

  const canStore = isConnected && fileHash && signerAddress && !isConfirming
  const canVerify = fileHash && signerAddress
  const showResults = verificationStarted && result !== undefined

  // Log state changes
  debug.log.debug('DocumentVerification state', {
    isConnected,
    hasFile: !!selectedFile,
    hasHash: !!fileHash,
    hasSigner: !!signerAddress,
    verificationStarted
  })

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* File Selection Section */}
      <div className="card">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          📁 Selección de Documento
        </h2>
        <FileSelector 
          onFileSelect={handleFileSelect} 
          disabled={!isConnected}
        />
      </div>

      {/* Signer Address Section */}
      <div className="card">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          👤 Dirección del Firmante
        </h2>
        <SignerAddressInput 
          onAddressChange={handleAddressChange}
          disabled={!isConnected}
        />
      </div>

      {/* Action Buttons */}
      <div className="card">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          ⚡ Acciones
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Store Document Button */}
          <button
            onClick={handleStoreDocument}
            disabled={!canStore}
            className="btn-primary flex-1 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isConfirming ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span className="hidden sm:inline">Almacenando...</span>
                <span className="sm:hidden">Procesando...</span>
              </span>
            ) : isConfirmed ? (
              <span className="flex items-center justify-center">
                <span className="hidden sm:inline">✅ Documento Almacenado</span>
                <span className="sm:hidden">✅ Almacenado</span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="hidden sm:inline">📦 Almacenar Documento</span>
                <span className="sm:hidden">📦 Almacenar</span>
              </span>
            )}
          </button>

          {/* Verify Document Button */}
          <button
            onClick={handleVerifyDocument}
            disabled={!canVerify || isVerifying}
            className="btn-success flex-1 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span className="hidden sm:inline">Verificando...</span>
                <span className="sm:hidden">Verificando</span>
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="hidden sm:inline">🔍 Verificar Documento</span>
                <span className="sm:hidden">🔍 Verificar</span>
              </span>
            )}
          </button>
        </div>

        {!isConnected && (
          <p className="text-yellow-600 text-sm mt-4">
            ⚡ Conecta tu wallet para habilitar todas las funciones
          </p>
        )}
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Resultados de Verificación
          </h2>
          <VerificationResult 
            result={result}
            fileHash={fileHash}
            expectedSigner={signerAddress}
            isLoading={isVerifying}
          />
        </div>
      )}

      {/* Transaction Status */}
      {isConfirming && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-800">
              Transacción en proceso... Esperando confirmaciones
            </p>
          </div>
        </div>
      )}

      {isConfirmed && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800">
              ✅ Transacción confirmada! Documento almacenado en blockchain
            </p>
          </div>
        </div>
      )}
    </div>
  )
}