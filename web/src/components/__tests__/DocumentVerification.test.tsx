import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {  } from 'ethers';
import DocumentVerification from '../DocumentVerification';

// Mock wagmi's useAccount hook
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

// Mock the file selector and contract
vi.mock('../FileSelector', () => ({
  default: ({ onFileSelect }: { onFileSelect: (file: File, hash: string) => void }) => (
    <div data-testid="file-selector">
      <button onClick={() => onFileSelect(new File(['test'], 'test.pdf'), '0xhash')}>Upload Test File</button>
    </div>
  )
});

vi.mock('../SignerAddressInput', () => ({
  default: ({ value, onChange, onVerify }: { value: string; onChange: (value: string) => void; onVerify: () => void }) => (
    <div data-testid="signer-input">
      <input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="0x..." 
      />
      <button onClick={onVerify} disabled={!value}>Verify</button>
    </div>
  ),
}));

vi.mock('../VerificationResult', () => ({
  default: ({ result, file }: { result: any; file: File | null }) => {
    if (!result || !file) return null;
    return (
      <div data-testid="verification-result">
        <p>Verified: {result.isValid ? 'Yes' : 'No'}</p>
        <p>Signer: {result.signer}</p>
      </div>
    );
  },
}));

// Create a mock file
function createMockFile() {
  return new File(['document content'], 'test.pdf', { type: 'application/pdf' });
}

describe('DocumentVerification', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (useAccount as any).mockReset();
  });

  it('shows connect wallet message when not connected', () => {
    (useAccount as any).mockReturnValue({ isConnected: false });
    
    render(<DocumentVerification />);
    
    expect(screen.getByText(/connect your wallet to verify documents/i)).toBeInTheDocument();
    expect(screen.queryByTestId('file-selector')).not.toBeInTheDocument();
    expect(screen.queryByTestId('signer-input')).not.toBeInTheDocument();
  });

  it('shows verification interface when connected', () => {
    (useAccount as any).mockReturnValue({ isConnected: true });
    
    render(<DocumentVerification />);
    
    expect(screen.getByTestId('file-selector')).toBeInTheDocument();
    expect(screen.getByTestId('signer-input')).toBeInTheDocument();
    expect(screen.getByText(/document verification/i)).toBeInTheDocument();
  });

  it('allows file selection and displays file details', async () => {
    const mockFile = createMockFile();
    const user = userEvent.setup();
    
    (useAccount as any).mockReturnValue({ isConnected: true });
    
    render(<DocumentVerification />);
    
    // Click the upload button in our mock
    const uploadButton = screen.getByText(/upload test file/i);
    await user.click(uploadButton);
    
    // The file selector should now show file details
    expect(screen.getByText(/selected file:/i)).toBeInTheDocument();
    expect(screen.getByText(/test.pdf/i)).toBeInTheDocument();
  });

  it('allows signer address input', async () => {
    const user = userEvent.setup();
    
    (useAccount as any).mockReturnValue({ isConnected: true });
    
    render(<DocumentVerification />);
    
    const signerInput = screen.getByPlaceholderText(/0x.../i);
    await user.type(signerInput, '0x1234567890abcdef1234567890abcdef1234567890');
    
    expect(signerInput).toHaveValue('0x1234567890abcdef1234567890abcdef1234567890');
  });

  it('shows spinner when verifying', async () => {
    const user = userEvent.setup();
    
    (useAccount as any).mockReturnValue({ isConnected: true });
    
    render(<DocumentVerification />);
    
    // Upload a file
    const uploadButton = screen.getByText(/upload test file/i);
    await user.click(uploadButton);
    
    // Enter signer address
    const signerInput = screen.getByPlaceholderText(/0x.../i);
    await user.type(signerInput, '0x1234567890abcdef1234567890abcdef1234567890');
    
    // Click verify
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);
    
    // Spinner should be visible
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});