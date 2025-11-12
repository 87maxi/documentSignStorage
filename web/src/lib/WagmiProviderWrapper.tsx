// web/src/lib/WagmiProviderWrapper.tsx
import React from 'react';
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
//import { mainnet, sepolia, anvil } from '../lib/wagmi';
//import { publicProvider } from 'wagmi/providers/public';
//import { http, webSocket } from 'wagmi/providers';

const queryClient = new QueryClient();

const WagmiProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const chains = [mainnet, sepolia, anvil];
  const publicClient = publicProvider({ chains });
  const webSocketPublicClient = publicProvider({ chains, webSocket: true });

  // const config = createConfig({
  //   autoConnect: true,
  //   publicClient,
  //   webSocketPublicClient,
  //   transports: {
  //     [mainnet.id]: {
  //       http: () => http('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
  //       webSocket: () => http('wss://mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID'),
  //     },
  //     [sepolia.id]: {
  //       http: () => http('https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'),
  //       webSocket: () => http('wss://sepolia.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID'),
  //     },
  //     [anvil.id]: {
  //       http: () => http('http://127.0.0.1:8545'),
  //     },
  //   },
  // });

  return (
    <WagmiProvider config={createConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={chains}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiProviderWrapper;
