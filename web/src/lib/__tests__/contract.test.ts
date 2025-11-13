import { renderHook, act } from '@testing-library/react';
import { useContract } from '@/lib/contract';

// Mock ethers
jest.mock('ethers', () => ({
  ...jest.requireActual('ethers'),
  ethers: {
    BrowserProvider: jest.fn(),
    JsonRpcProvider: jest.fn(),
    isAddress: jest.fn(),
  },
  Contract: jest.fn()
}));

// No MetaMask mocks needed - always use Anvil

describe('useContract', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    // Mock isAddress to return true (for address validation)
    jest.spyOn(require('ethers'), 'isAddress').mockReturnValue(true);
  });

  it('handles contract initialization error', async () => {
    // Spy on console.error to capture the error message
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock JsonRpcProvider to throw an error when creating
    (require('ethers').JsonRpcProvider as jest.Mock).mockImplementation(() => {
      throw new Error('Failed to connect to Anvil');
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useContract());
    
    // Wait for async initialization
    await waitForNextUpdate();
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to connect to Anvil');
    expect(result.current.contract).toBeNull();
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  describe('contract methods', () => {
      let contractMock: ReturnType<typeof jest.fn> & {
    registerDocument: jest.Mock;
    getDocumentInfo: jest.Mock;
    verifyDocument: jest.Mock;
    getSigner: jest.Mock;
  };
  let hook: { current: ReturnType<typeof useContract> };
    
    beforeEach(async () => {
      // Mock contract instance
      contractMock = {
        registerDocument: jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue(true)
        }),
        getDocumentInfo: jest.fn(),
        verifyDocument: jest.fn(),
        getSigner: jest.fn()
      };
      
      // Mock Contract constructor to return our mock
      (require('ethers').Contract as jest.Mock).mockReturnValue(contractMock);
      
      const renderResult = renderHook(() => useContract());
      hook = renderResult.result;
      
      // Wait for initialization
      await renderResult.waitForNextUpdate();
    });

    it('registerDocument calls contract method', async () => {
      const result = await hook.current.registerDocument('0xhash', 'document.pdf');
      
      expect(contractMock.registerDocument).toHaveBeenCalledWith('0xhash', 'document.pdf');
      expect(result).toBe(true);
    });

    it('getDocumentInfo returns formatted data', async () => {
      contractMock.getDocumentInfo.mockResolvedValue([
        '0xowner',
        { toNumber: () => 1234567890 },
        'document.pdf',
        true
      ]);
      
      const result = await hook.current.getDocumentInfo('0xhash');
      
      expect(contractMock.getDocumentInfo).toHaveBeenCalledWith('0xhash');
      expect(result).toEqual({
        owner: '0xowner',
        timestamp: 1234567890,
        name: 'document.pdf',
        active: true
      });
    });

    it('verifyDocument returns boolean result', async () => {
      contractMock.verifyDocument.mockResolvedValue(true);
      
      const result = await hook.current.verifyDocument('0xhash');
      
      expect(contractMock.verifyDocument).toHaveBeenCalledWith('0xhash');
      expect(result).toBe(true);
    });

    it('getSignerAddress returns signer address', async () => {
      contractMock.getSigner.mockResolvedValue('0xsigner');
      
      const result = await hook.current.getSignerAddress();
      
      expect(contractMock.getSigner).toHaveBeenCalled();
      expect(result).toBe('0xsigner');
    });
  });
});