import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentVerification from '../DocumentVerification';

// Mock child components
jest.mock('./FileSelector', () => ({
  __esModule: true,
  default: ({ onFileSelected }) => (
    <div data-testid="file-selector">
      <button onClick={() => onFileSelected(new File(['test'], 'test.pdf'), 'hash123')}>Select File</button>
    </div>
  )
}));

jest.mock('./SignerAddressInput', () => ({
  __esModule: true,
  default: ({ onAddressResolved }) => (
    <div data-testid="signer-input">
      <button onClick={() => onAddressResolved('0x123')}>Resolve Address</button>
    </div>
  )
}));

jest.mock('./VerificationResult', () => ({
  __esModule: true,
  default: ({ result }) => result ? <div data-testid="verification-result">Result: {result.hash}</div> : null
}));

describe('DocumentVerification', () => {
  it('renders correctly', () => {
    render(<DocumentVerification />);
    
    expect(screen.getByText('Verify Document Signature')).toBeInTheDocument();
    expect(screen.getByText('Verify the authenticity of a document by checking its hash on the blockchain')).toBeInTheDocument();
    
    // Check child components are rendered
    expect(screen.getByTestId('file-selector')).toBeInTheDocument();
    expect(screen.getByTestId('signer-input')).toBeInTheDocument();
  });

  it('enables verify button when file and signer are selected', async () => {
    render(<DocumentVerification />);
    
    // Initially disabled
    const verifyButton = screen.getByRole('button', { name: 'Verify Document' });
    expect(verifyButton).toBeDisabled();
    
    // Click file selector mock
    fireEvent.click(screen.getByText('Select File'));
    
    // Click signer input mock
    fireEvent.click(screen.getByText('Resolve Address'));
    
    // Verify button should now be enabled
    expect(verifyButton).not.toBeDisabled();
  });

  it('shows verification result after successful verification', async () => {
    render(<DocumentVerification />);
    
    // Select file and signer address
    fireEvent.click(screen.getByText('Select File'));
    fireEvent.click(screen.getByText('Resolve Address'));
    
    // Click verify
    const verifyButton = screen.getByRole('button', { name: 'Verify Document' });
    fireEvent.click(verifyButton);
    
    // Should show loading state
    expect(screen.getByRole('button', { name: 'Verifying...' })).toBeInTheDocument();
    
    // Wait for verification to complete
    await waitFor(() => {
      expect(screen.getByTestId('verification-result')).toBeInTheDocument();
    });
  });

  it('shows error when required fields are missing', async () => {
    render(<DocumentVerification />);
    
    // Click verify without selecting file or signer
    const verifyButton = screen.getByRole('button', { name: 'Verify Document' });
    fireEvent.click(verifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please select a document and signer address')).toBeInTheDocument();
    });
  });

  it('clears result when clear button is clicked', async () => {
    render(<DocumentVerification />);
    
    // Complete verification flow
    fireEvent.click(screen.getByText('Select File'));
    fireEvent.click(screen.getByText('Resolve Address'));
    fireEvent.click(screen.getByRole('button', { name: 'Verify Document' }));
    
    await waitFor(() => {
      expect(screen.getByTestId('verification-result')).toBeInTheDocument();
    });
    
    // Click clear button
    const clearButton = screen.getByRole('button', { name: 'Clear' });
    fireEvent.click(clearButton);
    
    expect(screen.queryByTestId('verification-result')).not.toBeInTheDocument();
  });
});
