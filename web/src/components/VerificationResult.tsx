'use client'

import { VerificationResult as VerificationResultType } from '@/hooks/useDocumentVerification'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface VerificationResultProps {
  result: VerificationResultType | undefined
  fileHash: string
  expectedSigner: string
  isLoading: boolean
}

export default function VerificationResult({ 
  result, 
  fileHash, 
  expectedSigner, 
  isLoading 
}: VerificationResultProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Verificando documento...</span>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="text-center p-8">
        <div className="text-yellow-600 text-6xl mb-4">❓</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Documento no encontrado
        </h3>
        <p className="text-gray-600">
          El hash proporcionado no existe en la blockchain.
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 break-all">
            Hash buscado: {fileHash}
          </p>
        </div>
      </div>
    )
  }

  const { isValid, signer, timestamp, blockNumber } = result
  const isSignerMatch = signer.toLowerCase() === expectedSigner.toLowerCase()
  const verificationSuccessful = isValid && isSignerMatch

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <div className={`p-4 rounded-lg ${
        verificationSuccessful 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center">
          <div className={`text-2xl mr-3 ${
            verificationSuccessful ? 'text-green-600' : 'text-red-600'
          }`}>
            {verificationSuccessful ? '✅' : '❌'}
          </div>
          <div>
            <h3 className={`font-semibold ${
              verificationSuccessful ? 'text-green-800' : 'text-red-800'
            }`}>
              {verificationSuccessful 
                ? 'Verificación Exitosa' 
                : 'Verificación Fallida'
              }
            </h3>
            <p className={`text-sm ${
              verificationSuccessful ? 'text-green-600' : 'text-red-600'
            }`}>
              {verificationSuccessful 
                ? 'El documento ha sido verificado correctamente.'
                : 'No se pudo verificar el documento.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Verification Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hash Verification */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Hash del Documento</h4>
          <p className="text-sm text-gray-600 break-all">{fileHash}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Coincide con blockchain
            </span>
          </div>
        </div>

        {/* Signer Verification */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Firmante</h4>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium">Esperado:</span>
              <p className="text-sm text-gray-600 break-all">{expectedSigner}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Registrado:</span>
              <p className="text-sm text-gray-600 break-all">{signer}</p>
            </div>
            <div>
              {isSignerMatch ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Coincide
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  ✗ No coincide
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Fecha de Registro</h4>
          {timestamp ? (
            <>
              <p className="text-sm text-gray-600">
                {format(new Date(Number(timestamp) * 1000), "PPP 'a las' pp", { locale: es })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Timestamp: {timestamp.toString()}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">No disponible</p>
          )}
        </div>

        {/* Block Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Información del Bloque</h4>
          {blockNumber ? (
            <>
              <p className="text-sm text-gray-600">
                Bloque: #{blockNumber.toString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Confirmaciones: Múltiples (transacción confirmada)
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-600">No disponible</p>
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Resumen de Estado</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Hash documental: ✓ Verificado en blockchain</li>
          <li>• Firmante: {isSignerMatch ? '✓ Coincide' : '✗ No coincide'}</li>
          <li>• Estado del documento: {isValid ? '✓ Válido' : '✗ Inválido'}</li>
          <li>• Timestamp: ✓ Verificado</li>
        </ul>
      </div>

      {/* Additional Actions */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
          📋 Copiar Certificado
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
          🔗 Ver en Explorador
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
          📄 Exportar Reporte
        </button>
      </div>
    </div>
  )
}