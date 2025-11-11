import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileSelector from '../FileSelector'

// Mock the fileUtils module
jest.mock('@/utils/fileUtils', () => ({
  calculateSHA256Hash: jest.fn().mockResolvedValue('0x' + 'ab'.repeat(32)),
  formatFileSize: jest.fn().mockReturnValue('1 KB'),
  isValidFileType: jest.fn().mockReturnValue(true),
  ALLOWED_FILE_TYPES: ['application/pdf', 'image/jpeg']
}))

describe('FileSelector', () => {
  const mockOnFileSelect = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<FileSelector onFileSelect={mockOnFileSelect} />)
    
    expect(screen.getByText(/Haz clic para subir/)).toBeInTheDocument()
    expect(screen.getByText(/PDF, Word, texto o imágenes/)).toBeInTheDocument()
  })

  it('handles file selection via input', async () => {
    const user = userEvent.setup()
    render(<FileSelector onFileSelect={mockOnFileSelect} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByTestId('file-input')
    
    await user.upload(input, file)
    
    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file, expect.any(String))
    })
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument()
  })

  it('shows error for invalid file type', async () => {
    const { isValidFileType } = require('@/utils/fileUtils')
    isValidFileType.mockReturnValueOnce(false)
    
    render(<FileSelector onFileSelect={mockOnFileSelect} />)
    
    const file = new File(['test content'], 'test.js', { type: 'application/javascript' })
    const input = screen.getByTestId('file-input')
    
    fireEvent.change(input, { target: { files: [file] } })
    
    await waitFor(() => {
      expect(screen.getByText(/Tipo de archivo no válido/)).toBeInTheDocument()
    })
    
    expect(mockOnFileSelect).not.toHaveBeenCalled()
  })

  it('shows loading state during hash calculation', async () => {
    const { calculateSHA256Hash } = require('@/utils/fileUtils')
    // Create a promise that we can resolve manually
    let resolveHash: (value: string) => void
    calculateSHA256Hash.mockImplementationOnce(() => 
      new Promise(resolve => {
        resolveHash = resolve
      })
    )
    
    render(<FileSelector onFileSelect={mockOnFileSelect} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const input = screen.getByTestId('file-input')
    
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(screen.getByText('Calculando hash...')).toBeInTheDocument()
    
    // Resolve the promise
    resolveHash!('0x' + 'cd'.repeat(32))
    
    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalled()
    })
  })

  it('disables interaction when disabled prop is true', () => {
    render(<FileSelector onFileSelect={mockOnFileSelect} disabled={true} />)
    
    // Check that the input is disabled
    const input = screen.getByTestId('file-input')
    expect(input).toBeDisabled()
    
    // Check that the drop zone text indicates disabled state
    expect(screen.getByText(/Haz clic para subir/)).toBeInTheDocument()
  })
})