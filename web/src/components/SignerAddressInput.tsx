'use client'

import { useState } from 'react'
import { isValidEthereumAddress, shortenAddress } from '@/utils/addressUtils'
import { debug } from '@/utils/debug'

interface SignerAddressInputProps {
  onAddressChange: (address: string) => void
  disabled?: boolean
}

export default function SignerAddressInput({ onAddressChange, disabled = false }: SignerAddressInputProps) {
  const [address, setAddress] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [touched, setTouched] = useState(false)

  const handleAddressChange = (value: string) => {
    setAddress(value)
    setTouched(true)
    
    const valid = isValidEthereumAddress(value)
    setIsValid(valid)
    
    if (valid) {
      onAddressChange(value)
      debug.log.debug('Valid Ethereum address entered', { address: value })
    } else {
      onAddressChange('')
      if (value) {
        debug.log.debug('Invalid Ethereum address entered', { address: value })
      }
    }
  }

  const getValidationMessage = () => {
    if (!touched) return null
    
    if (address === '') {
      return <span className="text-yellow-600 text-sm">Ingresa una dirección Ethereum</span>
    }
    
    if (!isValid) {
      return <span className="text-red-600 text-sm">Dirección Ethereum inválida</span>
    }
    
    return <span className="text-green-600 text-sm">✓ Dirección válida</span>
  }

  return (
    <div className="w-full">
      <label htmlFor="signer-address" className="block text-sm font-medium text-gray-700 mb-2">
        Dirección del Firmante
      </label>
      
      <div className="relative">
        <input
          id="signer-address"
          type="text"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          disabled={disabled}
          placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors ${
            touched && address !== ''
              ? isValid
                ? 'border-green-500 focus:ring-green-200'
                : 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
        
        {isValid && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        {getValidationMessage()}
      </div>
      
      {isValid && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Formato verificado:</strong> {shortenAddress(address)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Esta dirección será utilizada para verificar la firma del documento
          </p>
        </div>
      )}
    </div>
  )
}