interface EthereumProvider {
  isMetaMask?: true;
  request: (args: { method: string, params?: any[] }) => Promise<any>;
  on: (event: string, callback: (response: any) => void) => void;
  removeListener: (event: string, callback: (response: any) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}