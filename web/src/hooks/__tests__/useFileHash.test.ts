import { renderHook, act } from '@testing-library/react';
import { useFileHash } from '@/hooks/useFileHash';

describe('useFileHash', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hashes file successfully', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const { result } = renderHook(() => useFileHash());
    
    await act(async () => {
      await result.current.hashFile(file);
    });
    
    expect(result.current.fileHash).toBe('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    expect(result.current.isHashing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles hashing error', async () => {
    // Create a file that will cause an error (null file)
    const { result } = renderHook(() => useFileHash());
    
    let errorThrown: boolean = false;
    await act(async () => {
      try {
        await result.current.hashFile(null as any);
      } catch (e) {
        errorThrown = true;
        expect(e.message).toBe('No file provided');
      }
    });
    
    expect(errorThrown).toBe(true);
    expect(result.current.fileHash).toBe('');
    expect(result.current.isHashing).toBe(false);
    expect(result.current.error).toBeNull(); // Error is thrown, not stored in state
  });

  it('clears hash and error', () => {
    const { result } = renderHook(() => useFileHash());
    
    // Set some state
    act(() => {
      result.current.hashFile = '0x123';
    });
    
    // Clear hash
    act(() => {
      result.current.clearHash();
    });
    
    expect(result.current.fileHash).toBe('');
    expect(result.current.error).toBeNull();
  });
});