import { useState, useCallback } from 'react'
import { EthereumService } from '@/lib/ethers'
import { debug } from '@/utils/debug'

export interface DocumentInfo {
  signer: `0x${string}`
  timestamp: bigint
  blockNumber: bigint
  isValid: boolean
}

export interface VerificationResult {
  isValid: boolean
  signer: `0x${string}`
  timestamp: bigint
  blockNumber: bigint
}

export function useStoreDocument() {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

  const storeDocument = useCallback(async (documentHash: `0x${string}`, signerAddress: `0x${string}`) => {
    try {
      setIsConfirming(true)
      setIsConfirmed(false)
      setTransactionHash(null)

      debug.contract.methodCall('storeDocumentHash', [documentHash, signerAddress])
      
      const contract = EthereumService.getContract()
      const tx = await contract.storeDocumentHash(documentHash, signerAddress)
      
      setTransactionHash(tx.hash)
      debug.contract.transaction(tx.hash, 'storeDocumentHash')
      
      // Wait for transaction confirmation
      const receipt = await tx.wait()
      setIsConfirming(false)
      
      if (receipt?.status === 1) {
        setIsConfirmed(true)
        debug.contract.receipt(tx.hash, receipt.confirmations)
        return { hash: tx.hash }
      } else {
        throw new Error('Transaction failed')
      }
    } catch (error) {
      setIsConfirming(false)
      setIsConfirmed(false)
      debug.contract.error('storeDocumentHash', error)
      throw error
    }
  }, [])

  return {
    storeDocument,
    hash: transactionHash,
    isConfirming,
    isConfirmed,
  }
}

export function useVerifyDocument(documentHash?: `0x${string}`, signerAddress?: `0x${string}`) {
  const [result, setResult] = useState<VerificationResult | undefined>()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refetch = useCallback(async () => {
    if (!documentHash || !signerAddress) {
      setResult(undefined)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const contract = EthereumService.getReadOnlyContract()
      const data = await contract.verifyDocument(documentHash, signerAddress)
      
      const verificationResult: VerificationResult = {
        isValid: data[0],
        signer: data[1],
        timestamp: data[2],
        blockNumber: data[3],
      }
      
      setResult(verificationResult)
      setIsLoading(false)
      return verificationResult
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Verification failed')
      setError(error)
      setIsLoading(false)
      setResult(undefined)
      throw error
    }
  }, [documentHash, signerAddress])

  return {
    result,
    error,
    isLoading,
    refetch,
  }  
}

export function useGetDocumentInfo(documentHash?: `0x${string}`) {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | undefined>()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refetch = useCallback(async () => {
    if (!documentHash) {
      setDocumentInfo(undefined)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const contract = EthereumService.getReadOnlyContract()
      const data = await contract.getDocumentInfo(documentHash)
      
      const info: DocumentInfo = {
        signer: data[0],
        timestamp: data[1],
        blockNumber: data[2],
        isValid: data[3],
      }
      
      setDocumentInfo(info)
      setIsLoading(false)
      return info
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get document info')
      setError(error)
      setIsLoading(false)
      setDocumentInfo(undefined)
      throw error
    }
  }, [documentHash])

  return {
    documentInfo,
    error,
    isLoading,
    refetch,
  }
}

export function useHasDocument(userAddress?: `0x${string}`, documentHash?: `0x${string}`) {
  const [hasDocument, setHasDocument] = useState<boolean | undefined>()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refetch = useCallback(async () => {
    if (!userAddress || !documentHash) {
      setHasDocument(undefined)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const contract = EthereumService.getReadOnlyContract()
      const result = await contract.hasDocument(userAddress, documentHash)
      
      setHasDocument(result)
      setIsLoading(false)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check document ownership')
      setError(error)
      setIsLoading(false)
      setHasDocument(undefined)
      throw error
    }
  }, [userAddress, documentHash])

  return {
    hasDocument,
    error,
    isLoading,
    refetch,
  }
}