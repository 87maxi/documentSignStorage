import React from 'react';
import { render, screen } from '@testing-library/react';
import VerificationResult from '../VerificationResult';

const mockResult = {
  success: true,
  hash: '0x' + 'a'.repeat(64),
  signer: '0x742d35Cc6634C0532925a3b8D4C98aBd7788142C',
  verified: true,
  signatureValid: true,
  blockNumber: 12345678,
  timestamp: Math.floor(Date.now() / 1000) - 86400,
  transactionHash: '0x' + 'b'.repeat(64),
  message: 'Document verified successfully'
};

describe('VerificationResult', () => {
  it('renders null when no result is provided', () => {
    render(<VerificationResult result={null} />);
    expect(screen.queryByText(/Verification Result/i)).not.toBeInTheDocument();
  });

  it('renders verification result with all data', () => {
    render(<VerificationResult result={mockResult} />);
    
    // Check header
    expect(screen.getByText('Verification Result')).toBeInTheDocument();
    
    // Check status
    expect(screen.getByText('VERIFIED')).toBeInTheDocument();
    const statusBadge = screen.getByText('VERIFIED').closest('div');
    expect(statusBadge).toHaveClass('bg-green-100');
    
    // Check success icon
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    
    // Check message
    expect(screen.getByText('Document verified successfully')).toBeInTheDocument();
    
    // Check hash
    expect(screen.getByText('Document Hash')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockResult.hash))).toBeInTheDocument();
    
    // Check signer
    expect(screen.getByText('Signer Address')).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockResult.signer))).toBeInTheDocument();
    
    // Check block number
    expect(screen.getByText('Block Number')).toBeInTheDocument();
    expect(screen.getByText('12,345,678')).toBeInTheDocument();
    
    // Check timestamp
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    
    // Check transaction link
    const transactionLink = screen.getByText('View on Etherscan');
    expect(transactionLink).toBeInTheDocument();
    expect(transactionLink.closest('a')).toHaveAttribute('href', `https://etherscan.io/tx/${mockResult.transactionHash}`);
  });

  it('shows correct status for failed verification', () => {
    const failedResult = { ...mockResult, verified: false, success: false };
    render(<VerificationResult result={failedResult} />);
    
    const statusBadge = screen.getByText('NOT VERIFIED').closest('div');
    expect(statusBadge).toHaveClass('bg-red-100');
    
    // Check failure icon
    expect(screen.getByTestId('failure-icon')).toBeInTheDocument();
  });

  it('shows correct status for invalid signature', () => {
    const invalidSignatureResult = { ...mockResult, signatureValid: false, success: false };
    render(<VerificationResult result={invalidSignatureResult} />);
    
    const statusBadge = screen.getByText('SIGNATURE INVALID').closest('div');
    expect(statusBadge).toHaveClass('bg-yellow-100');
  });

  it('hides transaction details when no transaction hash', () => {
    const resultWithoutTx = { ...mockResult, transactionHash: undefined };
    render(<VerificationResult result={resultWithoutTx} />);
    
    expect(screen.queryByText('Transaction Details')).not.toBeInTheDocument();
    expect(screen.queryByText('View on Etherscan')).not.toBeInTheDocument();
  });
});
