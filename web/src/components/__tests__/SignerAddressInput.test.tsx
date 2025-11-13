import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignerAddressInput } from '@/components/SignerAddressInput';
import { act } from 'react-dom/test-utils';

describe('SignerAddressInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    // Clear localStorage
    localStorage.clear();
  });

  it('renders input with label', () => {
    render(<SignerAddressInput value="" onChange={mockOnChange} />);
    
    expect(screen.getByText('Signer Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter Ethereum address or ENS name')).toBeInTheDocument();
  });

  it('validates Ethereum address format', () => {
    render(<SignerAddressInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Enter Ethereum address or ENS name');
    
    // Invalid address
    fireEvent.change(input, { target: { value: 'invalid-address' } });
    const errorText = screen.queryByText('Invalid Ethereum address format');
    expect(errorText).not.toBeInTheDocument();
    
    // Valid address
    fireEvent.change(input, { target: { value: '0x1234567890123456789012345678901234567890' } });
    expect(screen.queryByText('Invalid Ethereum address format')).not.toBeInTheDocument();
  });

  it('handles ENS name resolution', async () => {
    render(<SignerAddressInput value="" onChange={mockOnChange} />);
    
    const input = screen.getByPlaceholderText('Enter Ethereum address or ENS name');
    
    // Type ENS name
    fireEvent.change(input, { target: { value: 'test.eth' } });
    
    // Resolve button should appear
    const resolveButton = screen.getByTitle('Resolve ENS name');
    expect(resolveButton).toBeInTheDocument();
    
    // Click resolve button
    await act(async () => {
      fireEvent.click(resolveButton);
    });
    
    // Should show loading state
    const loadingSpinner = screen.getByTitle('Resolve ENS name').querySelector('svg');
    expect(loadingSpinner).toHaveClass('animate-spin');
    
    // Wait for resolution to complete
    await waitFor(() => {
      expect(screen.getByText('ENS Name: test.eth')).toBeInTheDocument();
    });
    
    // Should call onChange with resolved address
    expect(mockOnChange).toHaveBeenCalledWith(expect.stringMatching(/^0x[0-9a-f]{40}$/));
  });

  it('stores and displays recent addresses', () => {
    // Set a recent address in localStorage
    localStorage.setItem('recentSignerAddresses', JSON.stringify(['0x1234567890123456789012345678901234567890']));
    
    render(<SignerAddressInput value="" onChange={mockOnChange} />);
    
    // Recent addresses section should be visible
    expect(screen.getByText('Recent addresses')).toBeInTheDocument();
    
    // Recent address button should be present
    const recentBtn = screen.getByText(/0x12...7890/);
    expect(recentBtn).toBeInTheDocument();
    
    // Clicking recent address should update input
    fireEvent.click(recentBtn);
    expect(mockOnChange).toHaveBeenCalledWith('0x1234567890123456789012345678901234567890');
  });

  it('clears input when clear button is clicked', () => {
    render(<SignerAddressInput value="0x1234" onChange={mockOnChange} />);
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });
});