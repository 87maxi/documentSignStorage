import { render, screen } from '@testing-library/react';
import VerificationResult from '../VerificationResult';

const mockFile = new File(['test content'], 'test-document.pdf', { type: 'application/pdf' });

const mockResult = {
  isValid: true,
  signer: '0x1234567890abcdef1234567890abcdef1234567890',
  timestamp: 1730000000,
  blockNumber: 12345678,
};

const mockInvalidResult = {
  isValid: false,
  signer: '0x0987654321fedcba0987654321fedcba0987654321',
  timestamp: 1730000000,
  blockNumber: 12345678,
};

describe('VerificationResult', () => {
  it('does not render when no result or file', () => {
    render(<VerificationResult result={null} file={null} />);
    
    expect(screen.queryByText(/verification result/i)).not.toBeInTheDocument();
  });

  it('does not render when no result', () => {
    render(<VerificationResult result={null} file={mockFile} />);
    
    expect(screen.queryByText(/verification result/i)).not.toBeInTheDocument();
  });

  it('does not render when no file', () => {
    render(<VerificationResult result={mockResult} file={null} />);
    
    expect(screen.queryByText(/verification result/i)).not.toBeInTheDocument();
  });

  it('renders correctly with valid result', () => {
    render(<VerificationResult result={mockResult} file={mockFile} />);
    
    expect(screen.getByText(/verification result/i)).toBeInTheDocument();
    expect(screen.getByText(/test-document.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/verified/i)).toBeInTheDocument();
    expect(screen.getByText(/0x1234567890abcdef1234567890abcdef1234567890/i)).toBeInTheDocument();
    expect(screen.getByText(/12345678/i)).toBeInTheDocument();
    expect(screen.getByText(/block number/i)).toBeInTheDocument();
  });

  it('shows invalid status when document is invalid', () => {
    render(<VerificationResult result={mockInvalidResult} file={mockFile} />);
    
    expect(screen.getByText(/verification result/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid/i)).toBeInTheDocument();
    expect(screen.getByText(/0x0987654321fedcba0987654321fedcba0987654321/i)).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    render(<VerificationResult result={mockResult} file={mockFile} />);
    
    // The exact format depends on the user's locale, but should contain year, month, day, hour, minute
    const timestampElement = screen.getByText(/\d{1,2}:\d{2} (AM|PM)/);
    expect(timestampElement).toBeInTheDocument();
  });
});