import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-600">DocVerify</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">Blockchain Document Verification</span>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}