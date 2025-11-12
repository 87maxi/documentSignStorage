interface SignerAddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onVerify: () => void;
}

export default function SignerAddressInput({ value, onChange, onVerify }: SignerAddressInputProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="signer-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Signer Address
          </label>
          <input
            type="text"
            id="signer-address"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="sm:self-end">
          <button
            onClick={onVerify}
            disabled={!value}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}