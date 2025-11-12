interface VerificationResultProps {
  result: {
    isValid: boolean;
    signer: string;
    timestamp: number;
    blockNumber: number;
  } | null;
  file: File | null;
}

export default function VerificationResult({ result, file }: VerificationResultProps) {
  if (!result || !file) {
    return null;
  }

  const formattedDate = result.timestamp ? new Date(result.timestamp * 1000).toLocaleString() : 'N/A';

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Verification Result</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Document</p>
          <p className="font-medium text-gray-800 dark:text-white">{file.name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          {result.isValid ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              Invalid
            </span>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Signer</p>
          <p className="font-mono text-sm text-gray-800 dark:text-white break-all">{result.signer}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Block Number</p>
          <p className="font-medium text-gray-800 dark:text-white">{result.blockNumber}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
          <p className="font-medium text-gray-800 dark:text-white">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}