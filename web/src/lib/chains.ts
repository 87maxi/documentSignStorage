// Define types for chain information
export interface Chain {
  id: number;
  name: string;
  rpcUrl: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  explorerUrl?: string;
}

// List of supported chains for Anvil and development
export const supportedChains: Chain[] = [
  {
    id: 31337,
    name: 'Local Anvil',
    rpcUrl: 'http://127.0.0.1:8545',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    explorerUrl: 'https://etherscan.io'
  },
  {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    explorerUrl: 'https://etherscan.io'
  },
  {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
    currency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18
    },
    explorerUrl: 'https://sepolia.etherscan.io'
  },
  {
    id: 84532,
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    currency: {
      name: 'Base Ether',
      symbol: 'ETH',
      decimals: 18
    },
    explorerUrl: 'https://sepolia.basescan.org'
  },
  {
    id: 11155420,
    name: 'Optimism Sepolia',
    rpcUrl: 'https://sepolia.optimism.io',
    currency: {
      name: 'Optimism Ether',
      symbol: 'OP',
      decimals: 18
    },
    explorerUrl: 'https://sepolia-optimistic.etherscan.io'
  }
];

// Get chain by ID
export const getChainById = (id: number): Chain | undefined => {
  return supportedChains.find(chain => chain.id === id);
};

// Get chain name by ID
export const getChainNameById = (id: number): string => {
  const chain = getChainById(id);
  return chain ? chain.name : `Unknown Chain (${id})`;
};