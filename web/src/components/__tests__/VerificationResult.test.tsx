import { render, screen } from '@testing-library/react'
import { VerificationResult } from '@/components/VerificationResult'

describe('VerificationResult Component', () => {
  const mockValidProps = {
    isValid: true,
    details: {
      hash: '0x1234567890123456789012345678901234567890123456789012345678901234',
      signer: '0x1234567890123456789012345678901234567890',
      timestamp: Math.floor(Date.now() / 1000),
      documentName: 'test.pdf',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    }
  }

  it('should render verified state', () => {
    render(<VerificationResult {...mockValidProps} />)
    
    expect(screen.getByText('Digital Signature Verified')).toBeInTheDocument()
    expect(screen.getByText(mockValidProps.details.signer)).toBeInTheDocument()
    expect(screen.getByText(mockValidProps.details.hash)).toBeInTheDocument()
  })

  it('should handle unverified state', () => {
    render(<VerificationResult isValid={false} details={mockValidProps.details} />)
    
    expect(screen.getByText('Verification Failed')).toBeInTheDocument()
    expect(screen.getByText('The document signature could not be verified on the blockchain.')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    render(<VerificationResult isLoading={true} />)
    
    expect(screen.getByText('Verifying Document')).toBeInTheDocument()
    expect(screen.getByText('Checking blockchain for document signature...')).toBeInTheDocument()
  })
})