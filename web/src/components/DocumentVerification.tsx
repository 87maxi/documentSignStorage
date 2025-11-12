"use client";

import React, { useState } from "react";
import FileSelector from "./FileSelector";
import SignerAddressInput from "./SignerAddressInput";
import VerificationResult from "./VerificationResult";

interface DocumentVerificationProps {
  contractAddress?: string;
}

const DocumentVerification: React.FC<DocumentVerificationProps> = ({ contractAddress = "0x..." }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [signerAddress, setSignerAddress] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (file: File, hash: string) => {
    setSelectedFile(file);
    setFileHash(hash);
    setVerificationResult(null);
    setError(null);
  };

  const handleAddressResolved = (address: string) => {
    setSignerAddress(address);
    setVerificationResult(null);
    setError(null);
  };

  const handleVerify = async () => {
    if (!fileHash || !signerAddress) {
      setError('Please select a document and signer address');
      return;
    }

    setIsVerifying(true);
    setError(null);

    // Mock verification - in production, this would call the smart contract
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result - in production, this would come from the blockchain
      const mockResult = {
        success: true,
        hash: fileHash,
        signer: signerAddress,
        verified: true,
        signatureValid: true,
        blockNumber: 12345678,
        timestamp: Math.floor(Date.now() / 1000) - 86400, // Yesterday
        transactionHash: '0x' + 'a'.repeat(64),
        message: 'Document hash found on blockchain and signature is valid'
      };
      
      setVerificationResult(mockResult);
    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Verify Document Signature</h2>
          <p className="mt-1 text-sm text-gray-600">
            Verify the authenticity of a document by checking its hash on the blockchain
          </p>
        </div>

        <div className="p-6 space-y-6">
          <FileSelector onFileSelected={handleFileSelected} />
          
          <SignerAddressInput onAddressResolved={handleAddressResolved} />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying || !fileHash || !signerAddress}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Document'
              )}
            </button>
            
            {(fileHash && signerAddress) && (
              <button
                type="button"
                onClick={() => {
                  setVerificationResult(null);
                  setError(null);
                }}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {verificationResult && (
            <VerificationResult result={verificationResult} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;