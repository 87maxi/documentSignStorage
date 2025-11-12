import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignerAddressInput from '../SignerAddressInput';

// Mock the async functions
jest.mock('../../utils/addressUtils', () => ({
  isValidEthereumAddress: jest.fn(),
  resolveENS: jest.fn()
}));

const mockOnAddressResolved = jest.fn();

describe('SignerAddressInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SignerAddressInput onAddressResolved={mockOnAddressResolved} />);
    
    expect(screen.getByLabelText('Signer Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Ethereum address or ENS name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resolve Address' })).toBeInTheDocument();
  });

  it('validates and resolves valid Ethereum address', async () => {
    // Mock the validation to return true for a valid address
    require('../../utils/addressUtils').isValidEthereumAddress.mockReturnValue(true);
    
    render(<SignerAddressInput onAddressResolved={mockOnAddressResolved} />);
    
    const input = screen.getByPlaceholderText('Enter Ethereum address or ENS name');
    const button = screen.getByRole('button', { name: 'Resolve Address' });
    
    fireEvent.change(input, { target: { value: '0x742d35Cc6634C0532925a3b8D4C98aBd7788142C' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/Verified: 0x742d...142C/i)).toBeInTheDocument();
      expect(mockOnAddressResolved).toHaveBeenCalledWith('0x742d35Cc6634C0532925a3b8D4C98aBd7788142C');
    });
  });

  it('resolves ENS name', async () => {
    // Mock the validation to return false (not a valid address)
    require('../../utils/addressUtils').isValidEthereumAddress.mockReturnValue(false);
    // Mock ENS resolution to return an address
    require('../../utils/addressUtils').resolveENS.mockResolvedValue('0x742d35Cc6634C0532925a3b8D4C98aBd7788142C');
    
    render(<SignerAddressInput onAddressResolved={mockOnAddressResolved} />);
    
    const input = screen.getByPlaceholderText('Enter Ethereum address or ENS name');
    const button = screen.getByRole('button', { name: 'Resolve Address' });
    
    fireEvent.change(input, { target: { value: 'test.eth' } });
    fireEvent.click(button);
    
    // Should show loading state
    expect(screen.getByRole('button', { name: 'Resolving...' })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Verified: 0x742d...142C/i)).toBeInTheDocument();
      expect(mockOnAddressResolved).toHaveBeenCalledWith('0x742d35Cc6634C0532925a3b8D4C98aBd7788142C');
    });
  });

  it('shows error for invalid input', async () => {
    // Mock both validation and ENS resolution to fail
    require('../../utils/addressUtils').isValidEthereumAddress.mockReturnValue(false);
    require('../../utils/addressUtils').resolveENS.mockResolvedValue(null);
    
    render(<SignerAddressInput onAddressResolved={mockOnAddressResolved} />);
    
    const input = screen.getByPlaceholderText('Enter Ethereum address or ENS name');
    const button = screen.getByRole('button', { name: 'Resolve Address' });
    
    fireEvent.change(input, { target: { value: 'invalid-address' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid Ethereum address or ENS name')).toBeInTheDocument();
      expect(mockOnAddressResolved).not.toHaveBeenCalled();
    });
  });

  it('handles ENS resolution failure', async () => {
    // Mock validation to fail
    require('../../utils/addressUtils').isValidEthereumAddress.mockReturnValue(false);
    // Mock ENS resolution to throw an error
    require('../../utils/addressUtils').resolveENS.mockRejectedValue(new Error('Resolution failed'));
    
    render(<SignerAddressInput onAddressResolved={mockOnAddressResolved} />);
    
    const input = screen.getByPlaceholderText('Enter Ethereum address or ENS name');
    const button = screen.getByRole('button', { name: 'Resolve Address' });
    
    fireEvent.change(input, { target: { value: 'test.eth' } });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to resolve ENS name')).toBeInTheDocument();
    });
  });

  it('shows and uses address history', async () => {
    render(<SignerAddressInput onAddressResolved={mockOnAddressResolved} />);
    
    const input = screen.getByPlaceholderText('Enter Ethereum address or ENS name');
    
    // Focus the input to show history
    fireEvent.focus(input);
    
    // History should be visible
    const historyItems = screen.getAllByText(/.../i);
    expect(historyItems.length).toBe(2);
    
    // Click on a history item
    fireEvent.click(historyItems[0].closest('button')!);
    
    await waitFor(() => {
      expect(input).toHaveValue('0x742d35Cc6634C0532925a3b8D4C98aBd7788142C');
      expect(screen.getByText(/Verified: 0x742d...142C/i)).toBeInTheDocument();
      expect(mockOnAddressResolved).toHaveBeenCalledWith('0x742d35Cc6634C0532925a3b8D4C98aBd7788142C');
    });
  });

  it('clears input when clear button is clicked', () => {
    render(<SignerAddressInput onAddressResolved={mockOnAddressResolved} />);
    
    const input = screen.getByPlaceholderText('Enter Ethereum address or ENS name');
    const clearButton = screen.getByTestId('clear-button');
    
    fireEvent.change(input, { target: { value: '0x123' } });
    fireEvent.click(clearButton);
    
    expect(input).toHaveValue('');
    expect(screen.queryByText(/Verified:/i)).not.toBeInTheDocument();
  });
});
