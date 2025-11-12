import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignerAddressInput from '../SignerAddressInput';

describe('SignerAddressInput', () => {
  const mockOnChange = jest.fn();
  const mockOnVerify = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnVerify.mockClear();
  });

  it('renders correctly', () => {
    render(
      <SignerAddressInput 
        value="" 
        onChange={mockOnChange} 
        onVerify={mockOnVerify} 
      />
    );
    
    expect(screen.getByLabelText(/signer address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /verify/i })).toBeInTheDocument();
  });

  it('updates value when input changes', async () => {
    const user = userEvent.setup();
    render(
      <SignerAddressInput 
        value="" 
        onChange={mockOnChange} 
        onVerify={mockOnVerify} 
      />
    );
    
    const input = screen.getByLabelText(/signer address/i);
    await user.type(input, '0x1234567890abcdef1234567890abcdef1234567890');
    
    expect(mockOnChange).toHaveBeenCalledTimes(43);
    expect(mockOnChange).toHaveBeenLastCalledWith('0x1234567890abcdef1234567890abcdef1234567890');
  });

  it('calls onVerify when verify button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SignerAddressInput 
        value="0x1234567890abcdef1234567890abcdef1234567890" 
        onChange={mockOnChange} 
        onVerify={mockOnVerify} 
      />
    );
    
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);
    
    expect(mockOnVerify).toHaveBeenCalledTimes(1);
  });

  it('disables verify button when value is empty', () => {
    render(
      <SignerAddressInput 
        value="" 
        onChange={mockOnChange} 
        onVerify={mockOnVerify} 
      />
    );
    
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).toBeDisabled();
  });

  it('enables verify button when value is not empty', () => {
    render(
      <SignerAddressInput 
        value="0x1234567890abcdef1234567890abcdef1234567890" 
        onChange={mockOnChange} 
        onVerify={mockOnVerify} 
      />
    );
    
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).not.toBeDisabled();
  });
});