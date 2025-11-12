import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileSelector from '../FileSelector';

// Mock the calculateFileHash function
jest.mock('../../utils/fileUtils', () => ({
  calculateFileHash: jest.fn(() => Promise.resolve('testhash123'))
}));

const mockOnFileSelected = jest.fn();

describe('FileSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FileSelector onFileSelected={mockOnFileSelected} />);
    
    expect(screen.getByText('Select Document')).toBeInTheDocument();
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.getByText('or drag and drop')).toBeInTheDocument();
    expect(screen.getByText('PDF, DOC, DOCX, TXT up to 10MB')).toBeInTheDocument();
  });

  it('handles file selection via click', async () => {
    render(<FileSelector onFileSelected={mockOnFileSelected} />);
    
    const file = new File(['hello world'], 'test.pdf', { type: 'application/pdf' });
    
    // Mock the click behavior
    const fileInput = screen.getByTestId('file-input');
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockOnFileSelected).toHaveBeenCalledWith(file, 'testhash123');
    });
  });

  it('displays file preview after selection', async () => {
    render(<FileSelector onFileSelected={mockOnFileSelected} />);
    
    const file = new File(['hello world'], 'document.pdf', { type: 'application/pdf' });
    
    const input = screen.getByTestId('file-input');
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByText('4.0 KB')).toBeInTheDocument();
    });
  });

  it('handles drag and drop', async () => {
    render(<FileSelector onFileSelected={mockOnFileSelected} />);
    
    const file = new File(['hello world'], 'test.pdf', { type: 'application/pdf' });
    const dropArea = screen.getByText('Click to upload').closest('div')!;
    
    // Simulate drag over
    fireEvent.dragOver(dropArea);
    expect(dropArea).toHaveClass('border-blue-500');
    
    // Simulate drop
    const dataTransfer = {
      files: [file],
      items: [],
      types: ['Files']
    };
    
    fireEvent.drop(dropArea, { dataTransfer });
    
    await waitFor(() => {
      expect(mockOnFileSelected).toHaveBeenCalledWith(file, 'testhash123');
    });
  });

  it('shows error for empty file', async () => {
    render(<FileSelector onFileSelected={mockOnFileSelected} />);
    
    const file = new File([], 'empty.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(screen.getByText('File is empty')).toBeInTheDocument();
      expect(mockOnFileSelected).not.toHaveBeenCalled();
    });
  });

  it('clears file when remove button is clicked', async () => {
    render(<FileSelector onFileSelected={mockOnFileSelected} />);
    
    const file = new File(['hello world'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input');
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
    
    // Click remove button
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
  });
});
