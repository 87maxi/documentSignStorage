'use client'

import { useState, useCallback } from 'react'
import { calculateSHA256Hash, formatFileSize, isValidFileType, ALLOWED_FILE_TYPES } from '@/utils/fileUtils'
import { debug, PerformanceMonitor } from '@/utils/debug'

interface FileSelectorProps {
  onFileSelect: (file: File, hash: string) => void
  disabled?: boolean
}

export default function FileSelector({ onFileSelect, disabled = false }: FileSelectorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileHash, setFileHash] = useState<string>('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string>('')

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    
    if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
      const errorMsg = 'Tipo de archivo no válido. Por favor, sube un PDF, Word, texto o imagen.'
      setError(errorMsg)
      debug.file.validation(file, false, 'Invalid file type')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      const errorMsg = 'El archivo es demasiado grande. Máximo 10MB permitido.'
      setError(errorMsg)
      debug.file.validation(file, false, 'File too large')
      return
    }

    setSelectedFile(file)
    setIsCalculating(true)
    debug.file.selection(file)

    try {
      const hash = await PerformanceMonitor.measureAsync(
        'SHA256_Hash_Calculation',
        () => calculateSHA256Hash(file)
      )
      
      setFileHash(hash)
      onFileSelect(file, hash)
      debug.file.hashCalculation(hash, PerformanceMonitor.end('SHA256_Hash_Calculation'))
      debug.file.validation(file, true)
    } catch (err) {
      const errorMsg = 'Error al calcular el hash del archivo'
      setError(errorMsg)
      debug.file.validation(file, false, 'Hash calculation failed')
      debug.log.error('Hash calculation error:', err)
    } finally {
      setIsCalculating(false)
    }
  }, [onFileSelect])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const file = event.dataTransfer.files?.[0]
    if (!file) return

    setError('')
    
    if (!isValidFileType(file, ALLOWED_FILE_TYPES)) {
      const errorMsg = 'Tipo de archivo no válido. Por favor, sube un PDF, Word, texto o imagen.'
      setError(errorMsg)
      debug.file.validation(file, false, 'Invalid file type')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      const errorMsg = 'El archivo es demasiado grande. Máximo 10MB permitido.'
      setError(errorMsg)
      debug.file.validation(file, false, 'File too large')
      return
    }

    setSelectedFile(file)
    setIsCalculating(true)
    debug.file.selection(file)

    try {
      const hash = await PerformanceMonitor.measureAsync(
        'SHA256_Hash_Calculation_DragDrop',
        () => calculateSHA256Hash(file)
      )
      
      setFileHash(hash)
      onFileSelect(file, hash)
      debug.file.hashCalculation(hash, PerformanceMonitor.end('SHA256_Hash_Calculation_DragDrop'))
      debug.file.validation(file, true)
    } catch (err) {
      const errorMsg = 'Error al calcular el hash del archivo'
      setError(errorMsg)
      debug.file.validation(file, false, 'Hash calculation failed')
      debug.log.error('Hash calculation error:', err)
    } finally {
      setIsCalculating(false)
    }
  }, [onFileSelect])

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-gray-400 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDrop={disabled ? undefined : handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          data-testid="file-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={ALLOWED_FILE_TYPES.join(',')}
          disabled={disabled}
        />
        
        <div className="space-y-4">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {isCalculating ? (
            <div className="text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Calculando hash...
            </div>
          ) : selectedFile ? (
            <div className="text-left">
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                Tamaño: {formatFileSize(selectedFile.size)}
              </p>
              <p className="text-sm text-gray-500 break-all mt-2">
                Hash: {fileHash}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">Haz clic para subir</span> o arrastra y suelta
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, Word, texto o imágenes (máx. 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}