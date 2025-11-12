import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, http } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

// Define Anvil chain
const anvil = {
  id: 31337,
  name: 'Anvil',
  network: 'anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Anvil', url: 'http://127.0.0.1:8545' },
  },
  testnet: true,
};

// Configure chains and providers
const chains = [mainnet, sepolia, anvil];
const publicClient = publicProvider({ chains });
const webSocketPublicClient = publicProvider({ chains, webSocket: true });

// Create wagmi config
export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  transports: {
    [mainnet.id]: {
      http: () => http('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
      webSocket: () => http('wss://mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID'),
    },
    [sepolia.id]: {
      http: () => http('https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
      webSocket: () => http('wss://sepolia.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID'),
    },
    [anvil.id]: {
      http: () => http('http://127.0.0.1:8545'),
    },
  },
});

// Create query client
const queryClient = new QueryClient();

// Export providers and utilities
export { WagmiProvider, QueryClientProvider, RainbowKitProvider, ConnectButton, chains, queryClient };
