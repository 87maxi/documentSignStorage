import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileSelector } from '@/components/FileSelector';
import { act } from 'react';

describe('FileSelector', () => {
  const mockOnFileSelect = jest.fn();
  const mockOnFileRemove = jest.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
    mockOnFileRemove.mockClear();
  });

  it('renders upload area when no file is selected', () => {
    render(<FileSelector onFileSelect={mockOnFileSelect} onFileRemove={mockOnFileRemove} />);
    
    expect(screen.getByText('Select Document')).toBeInTheDocument();
    expect(screen.getByText('Upload a file')).toBeInTheDocument();
    expect(screen.getByText('or drag and drop')).toBeInTheDocument();
    expect(screen.getByText('PDF, DOC, TXT, or image up to 10MB')).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    render(<FileSelector onFileSelect={mockOnFileSelect} onFileRemove={mockOnFileRemove} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    const input = screen.getByLabelText('Upload a file');
    
    await act(async () => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    
    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByText('4 KB')).toBeInTheDocument();
  });

  it('handles drag and drop', () => {
    render(<FileSelector onFileSelect={mockOnFileSelect} onFileRemove={mockOnFileRemove} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const dropArea = screen.getByText('or drag and drop').closest('div')!;
    
    // Simulate drag over
    fireEvent.dragOver(dropArea);
    expect(dropArea).toHaveClass('border-blue-500');
    
    // Simulate drop
    fireEvent.drop(dropArea, {
      dataTransfer: {
        files: [file]
      }
    });
    
    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('displays file information after selection', () => {
    render(<FileSelector onFileSelect={mockOnFileSelect} onFileRemove={mockOnFileRemove} />);
    
    const file = new File(['test content'], 'document.pdf', { type: 'application/pdf' });
    
    const input = screen.getByLabelText('Upload a file');
    
    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText('12 KB')).toBeInTheDocument(); // Approximate size
  });

  it('removes file when remove button is clicked', () => {
    render(<FileSelector onFileSelect={mockOnFileSelect} onFileRemove={mockOnFileRemove} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    const input = screen.getByLabelText('Upload a file');
    
    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);
    
    expect(mockOnFileRemove).toHaveBeenCalled();
    expect(screen.getByText('Upload a file')).toBeInTheDocument();
  });

  it('validates file type', () => {
    render(
      <FileSelector 
        onFileSelect={mockOnFileSelect} 
        onFileRemove={mockOnFileRemove}
        allowedTypes={['application/pdf']}
      />);
    
    // Mock alert
    window.alert = jest.fn();
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload a file');
    
    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });
    
    expect(window.alert).toHaveBeenCalledWith('File type not allowed. Allowed types: application/pdf');
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });
});