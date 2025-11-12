import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileSelector from '../FileSelector';

// Mock file creation function
function createFile(name: string, size: number = 1024, type: string = 'text/plain') {
  const file = new File([new ArrayBuffer(size)], name, { type });
  return file;
}

describe('FileSelector', () => {
  const mockOnFileSelect = jest.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('renders correctly', () => {
    render(<FileSelector onFileSelect={mockOnFileSelect} />);
    
    expect(screen.getByText(/select a file or drag and drop here/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf, doc, docx, txt, etc./i)).toBeInTheDocument();
  });

  it('allows file selection via click', async () => {
    const user = userEvent.setup();
    const testFile = createFile('test-document.pdf', 2048, 'application/pdf');
    
    render(<FileSelector onFileSelect={mockOnFileSelect} />);
    
    // Find the file input and upload a file
    const fileInput = screen.getByLabelText(/select a file or drag and drop here/i);
    const input = fileInput.querySelector('input[type="file"][id="file-upload"][class="hidden"]');
    
    // Ensure we have a valid DOM element
    if (!input) {
      throw new Error('File input not found');
    }
    
    // Upload the file
    await user.upload(input, testFile);
    
    // Check that onFileSelect was called
    expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
    expect(mockOnFileSelect).toHaveBeenCalledWith(testFile, expect.any(String));
    
    // Verify the hash is a valid SHA-256 (64 hex characters plus 0x prefix)
    const hash = mockOnFileSelect.mock.calls[0][1];
    expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    
    // Check that the file details are displayed
    expect(screen.getByText(/selected file:/i)).toBeInTheDocument();
    expect(screen.getByText(/test-document.pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/size:/i)).toBeInTheDocument();
    expect(screen.getByText(/2.00 KB/i)).toBeInTheDocument();
  });

  it('allows file selection via drag and drop', async () => {
    const user = userEvent.setup();
    const testFile = createFile('test-document.pdf', 2048, 'application/pdf');
    
    render(<FileSelector onFileSelect={mockOnFileSelect} />);
    
    const dropZone = screen.getByLabelText(/select a file or drag and drop here/i);
    
    // Simulate drag enter
    await userEvent.dnd(upload => upload.beginDrag(dropZone), {
      dataTransfer: {
        types: ['Files'],
        files: [testFile],
      },
    });
    
    // Now drop the file
    await fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [testFile],
      },
    });
    
    // Check that onFileSelect was called
    expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
    expect(mockOnFileSelect).toHaveBeenCalledWith(testFile, expect.any(String));
    
    // Verify the hash
    const hash = mockOnFileSelect.mock.calls[0][1];
    expect(hash).toMatch(/^0x[a-fA-F0-9]{64}$/);
  });

  it('removes selected file when remove button is clicked', async () => {
    const user = userEvent.setup();
    const testFile = createFile('test-document.pdf');
    
    render(<FileSelector onFileSelect={mockOnFileSelect} />);
    
    // Select a file first
    const input = screen.getByLabelText(/select a file or drag and drop here/i)
      .querySelector('input[type="file"][id="file-upload"][class="hidden"]');
    
    if (!input) {
      throw new Error('File input not found');
    }
    
    await user.upload(input, testFile);
    
    // Now click the remove button
    const removeButton = screen.getByText(/remove file/i);
    await user.click(removeButton);
    
    // Check that onFileSelect was called with null
    expect(mockOnFileSelect).toHaveBeenCalledTimes(2);
    // Second call should be with null file and empty hash
    expect(mockOnFileSelect).toHaveBeenLastCalledWith(null, '');
    
    // File details should no longer be visible
    expect(screen.queryByText(/selected file:/i)).not.toBeInTheDocument();
  });
});