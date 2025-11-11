import { 
  calculateSHA256Hash, 
  formatFileSize, 
  getFileExtension, 
  isValidFileType,
  ALLOWED_FILE_TYPES 
} from '../fileUtils'

// Mock window.crypto.subtle
beforeAll(() => {
  Object.defineProperty(window, 'crypto', {
    value: {
      subtle: {
        digest: async (algorithm: string, data: ArrayBuffer) => {
          if (algorithm === 'SHA-256') {
            // Return a mock hash for testing
            const hash = new Uint8Array(32).fill(0xab)
            return hash.buffer
          }
          throw new Error('Algorithm not supported in mock')
        }
      }
    },
    writable: true
  })
})

describe('fileUtils', () => {
  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1048576)).toBe('1 MB')
      expect(formatFileSize(1073741824)).toBe('1 GB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })
  })

  describe('getFileExtension', () => {
    it('extracts file extensions correctly', () => {
      expect(getFileExtension('document.pdf')).toBe('pdf')
      expect(getFileExtension('image.jpeg')).toBe('jpeg')
      expect(getFileExtension('file.with.dots.txt')).toBe('txt')
      expect(getFileExtension('noextension')).toBe('')
    })
  })

  describe('isValidFileType', () => {
    it('validates file types correctly', () => {
      const pdfFile = new File([''], 'document.pdf', { type: 'application/pdf' })
      const jpgFile = new File([''], 'image.jpg', { type: 'image/jpeg' })
      const invalidFile = new File([''], 'script.js', { type: 'application/javascript' })

      expect(isValidFileType(pdfFile, ALLOWED_FILE_TYPES)).toBe(true)
      expect(isValidFileType(jpgFile, ALLOWED_FILE_TYPES)).toBe(true)
      expect(isValidFileType(invalidFile, ALLOWED_FILE_TYPES)).toBe(false)
    })
  })

  describe('calculateSHA256Hash', () => {
    it('calculates SHA-256 hash for empty file', async () => {
      const file = new File([''], 'empty.txt', { type: 'text/plain' })
      const hash = await calculateSHA256Hash(file)
      
      // Hash of empty string (mock returns all 0xab)
      expect(hash).toBe('0x' + 'ab'.repeat(32))
    })

    it('calculates SHA-256 hash for non-empty file', async () => {
      const content = 'Hello, World!'
      const file = new File([content], 'test.txt', { type: 'text/plain' })
      const hash = await calculateSHA256Hash(file)
      
      expect(hash).toBe('0x' + 'ab'.repeat(32))
    })
  })
})