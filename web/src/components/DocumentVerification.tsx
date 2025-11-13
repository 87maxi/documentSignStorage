"use client"
import React from 'react';
import { useState } from 'react';
import { FileSelector } from '@/components/FileSelector';
import { SignerAddressInput } from '@/components/SignerAddressInput';
import { VerificationResult } from '@/components/VerificationResult';
import { useFileHash } from '@/hooks/useFileHash';
import { useContract } from '@/lib/contract';
import { ethers } from 'ethers';

export function DocumentVerification() {
  const [file, setFile] = useState<File | null>(null);
  const [signerAddress, setSignerAddress] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean | null;
    details: {
      hash: string;
      signer: string;
      timestamp: number;
      documentName: string;
      transactionHash: string;
    } | null;
    error: string | null;
  }>({ isValid: null, details: null, error: null });
  
  const { fileHash, isHashing, error: hashError, hashFile, clearHash } = useFileHash();
  const { 
    verifyDocument, 
    getDocumentInfo,
    isLoading: contractLoading,
    error: contractError,
    provider
  } = useContract();
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    clearHash();
    setVerificationResult({ isValid: null, details: null, error: null });
  };
  
  const handleFileRemove = () => {
    setFile(null);
    clearHash();
    setVerificationResult({ isValid: null, details: null, error: null });
  };
  
  const handleSignerAddressChange = (address: string) => {
    setSignerAddress(address);
    setVerificationResult({ isValid: null, details: null, error: null });
  };
  
  const handleVerify = async () => {
    if (!file) {
      setVerificationResult({ 
        isValid: false, 
        details: null, 
        error: 'Please select a document to verify' 
      });
      return;
    }
    
    if (!signerAddress) {
      setVerificationResult({ 
        isValid: false, 
        details: null, 
        error: 'Please enter a signer address' 
      });
      return;
    }
    
    try {
      setVerificationResult({ 
        isValid: null, 
        details: null, 
        error: null 
      });
      
      // Validate signer address format
      if (!ethers.isAddress(signerAddress)) {
        setVerificationResult({ 
          isValid: false, 
          details: null, 
          error: 'Invalid signer address format' 
        });
        return;
      }
      
      // Hash the file
      const hash = await hashFile(file);
      
      // Verify document on blockchain
      // Since we're using Anvil accounts, we can sign the message with the provider
      const signer = await provider.getSigner(signerAddress);
      // Sign the document hash
      const signature = await signer.signMessage(ethers.getBytes(hash));
      // Verify document on blockchain with signature
      const isValid = await verifyDocument(hash, signerAddress, signature);
      
      if (isValid) {
        // Get document details
        const info = await getDocumentInfo(hash);
        
        if (info) {
          setVerificationResult({
            isValid: true,
            details: {
              hash,
              signer: info.signer,
              timestamp: info.timestamp,
              documentName: file.name,
              transactionHash: "0x" + "1".repeat(64) // Placeholder - in real app, this would come from transaction receipt
            },
            error: null
          });
        } else {
          setVerificationResult({
            isValid: false,
            details: { hash, signer: signerAddress, timestamp: Date.now() / 1000, documentName: file.name, transactionHash: "" },
            error: 'Signer address does not match document owner'
          });
        }
      } else {
        setVerificationResult({
          isValid: false,
          details: { hash, signer: signerAddress, timestamp: Date.now() / 1000, documentName: file.name, transactionHash: "" },
          error: 'Document not found on blockchain'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setVerificationResult({
        isValid: false,
        details: fileHash ? { 
          hash: fileHash, 
          signer: signerAddress, 
          timestamp: Date.now() / 1000, 
          documentName: file.name, 
          transactionHash: "" 
        } : null,
        error: errorMessage
      });
    }
  };
  
  const isVerifying = isHashing || contractLoading;
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          Verify Document Signature
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
      Upload a document and enter the signer's blockchain address to verify its digital signature.
        </p>
      </div>
      
      <FileSelector 
        onFileSelect={handleFileSelect} 
        onFileRemove={handleFileRemove} 
      />
      
      <SignerAddressInput 
        value={signerAddress} 
        onChange={handleSignerAddressChange} 
      />

      {verificationResult.isValid !== null && (
        <VerificationResult result={verificationResult} />
      )}
      
      <div className="flex justify-end">
        <button
          onClick={handleVerify}
          disabled={!file || !signerAddress || isVerifying}
          className="btn btn-primary px-8 py-3 text-lg flex items-center space-x-2 transition-all duration-200 hover:shadow-2xl"
        >
          {isVerifying ? (
            <>
              <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            <>
              Verify
              <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
