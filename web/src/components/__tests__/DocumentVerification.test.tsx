import { render, screen } from '@testing-library/react'
import { DocumentVerification } from '@/components/DocumentVerification'

jest.mock('@/lib/wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnecting: false,
    isDisconnected: false
  })
}))

describe('DocumentVerification Component', () => {
  it('should render verification form', () => {
    render(<DocumentVerification />)
    
    expect(screen.getByLabelText(/File Hash/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter file hash/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument()
  })

  it('should show validation errors', () => {
    render(<DocumentVerification />)
    
    const button = screen.getByRole('button', { name: /Verify/i })
    button.click()
    
    expect(screen.getByText('File hash is required')).toBeInTheDocument()
  })
})