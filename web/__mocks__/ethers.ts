const mockProvider = {
  getNetwork: jest.fn().mockResolvedValue({ chainId: 31337 }),
  waitForTransaction: jest.fn().mockResolvedValue({})
};

const mockSigner = {
  getAddress: jest.fn().mockResolvedValue('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
  signMessage: jest.fn().mockResolvedValue('mock-signature')
};

jest.mock('ethers', () => ({
  ethers: {
    providers: {
      JsonRpcProvider: jest.fn(() => mockProvider)
    },
    Wallet: jest.fn(() => ({
      connect: jest.fn(() => mockProvider)
    })),
    getBytes: jest.fn(),
    hashMessage: jest.fn()
  },
  JsonRpcProvider: jest.fn(() => mockProvider),
  Wallet: jest.fn(() => mockSigner),
  Overrides: {},
  getDefaultProvider: jest.fn(() => mockProvider),
  providers: {
    getDefaultProvider: jest.fn(() => mockProvider)
  }
}));