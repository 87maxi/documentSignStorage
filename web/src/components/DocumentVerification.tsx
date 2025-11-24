"use client"
import React from 'react';
import { useState } from 'react';
import { FileSelector } from '@/components/FileSelector';
import { SignerAddressInput } from '@/components/SignerAddressInput';
import { VerificationResult } from '@/components/VerificationResult';
import { useFileHash } from '@/hooks/useFileHash';
import { useContract } from '@/lib/contract';
import { useWallet } from '../contexts/walletContext';
import { ethers } from 'ethers';

export function DocumentVerification() {
  const [file, setFile] = useState<File | null>(null);
  const [signerAddress, setSignerAddress] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    error: string | null;
  }>({ success: false, error: null });
  
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean | null;
    details: {
      hash: string;
      signer: string;
      timestamp: number;
      documentName: string;
      documentSize: number;
      documentType: string;
      transactionHash: string;
    } | null;
    error: string | null;
  }>({ isValid: null, details: null, error: null });
  
  
  const {isHashing, hashFile, reset } = useFileHash();
  const { 
    blockHash,
    verifyDocument, 
    getDocumentInfo,
    storeDocumentHash,
    isLoading: contractLoading,
    error: contractError,
    contract
  } = useContract();
  
  const { anvilWallets, isConnected, selectedAccount } = useWallet();

  const handleFileSelect = (selectedFile: File) => {
    console.log('📁 File selected:', selectedFile.name);
    setFile(selectedFile);
    setVerificationResult({ isValid: null, details: null, error: null });
    setRegistrationResult({ success: false, error: null });
  };
  
  const handleFileRemove = () => {
    console.log('🗑️ File removed');
    setFile(null);
    setVerificationResult({ isValid: null, details: null, error: null });
    setRegistrationResult({ success: false, error: null });
  };
  
  const handleSignerAddressChange = (address: string) => {
    console.log('👤 Signer address changed:', address);
    setSignerAddress(address);
    setVerificationResult({ isValid: null, details: null, error: null });
    setRegistrationResult({ success: false, error: null });
  };
  
  const handleRegisterDocument = async () => {
    console.log('🚀 Starting document registration...');
    
    try {
      if (!file) {
        alert('Please select a document first');
        return;
      }

      if (!signerAddress) {
        alert('Please enter a signer address');
        return;
      }
      
      if (!ethers.isAddress(signerAddress)) {
        alert('Invalid signer address format');
        return;
      }

      setIsRegistering(true);
      setRegistrationResult({ success: false, error: null });

      if (!isConnected) {
        throw new Error('Wallet not connected. Please ensure Anvil is running and accessible.');
      }
      
      if (!anvilWallets || anvilWallets.length === 0) {
        throw new Error('No wallets available. Please check Anvil connection.');
      }

      const wallet = anvilWallets.find(
        w => w.account.address.toLowerCase() === signerAddress.toLowerCase()
      );
      
      if (!wallet) {
        throw new Error(`Signer wallet not found for address ${signerAddress}`);
      }

      console.log('✅ Wallet found:', wallet.account.address);

      // Hash del archivo
      console.log('📊 Hashing file for registration...');
      const hash = await hashFile(file);
      console.log('✅ File hashed:', hash);

      // Crear timestamp actual
      const timestamp = Math.floor(Date.now() / 1000);
      console.log('⏰ Timestamp:', timestamp);

      // Firmar el hash
      console.log('✍️ Signing hash for registration...');
      //const messageToSign = ethers.getBytes(hash);
      const signature = await wallet.signer.signMessage(hash);
      console.log('✅ Hash signed, signature:', signature);

      // Verificar la firma localmente
      try {
        const recoveredAddress = ethers.verifyMessage(hash, signature);
        console.log('🔐 Recovered address from signature:', recoveredAddress);
        console.log('🔐 Expected address:', wallet.account.address);
        console.log('🔐 Address match:', recoveredAddress.toLowerCase() === wallet.account.address.toLowerCase());
      } catch (recoverError) {
        console.error('❌ Error recovering address from signature:', recoverError);
      }

      // Confirmar registro
      if (!window.confirm(`Please confirm document registration:\n\nDocument: ${file.name}\nSigner: ${signerAddress}\n\nThis will store the document on blockchain and cost gas fees.`)) {
        console.log('❌ User cancelled registration');
        setRegistrationResult({ success: false, error: 'Registration cancelled by user' });
        return;
      }

      // Registrar en blockchain
      console.log('📝 Registering document on contract...');
      const success = await storeDocumentHash(hash, timestamp, signature);
      
      if (success) {
        console.log('✅ Document registered successfully!');
        
        // MARcar registro como exitoso INMEDIATAMENTE
        setRegistrationResult({ success: true, error: null });
        
        // Limpiar cualquier verificación anterior
        setVerificationResult({ isValid: null, details: null, error: null });
        
        console.log('✅ UI updated with successful registration');
        
      } else {
        throw new Error('Failed to register document');
      }

    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setRegistrationResult({ success: false, error: errorMessage });
    } finally {
      setIsRegistering(false);
    }
  };
  
const handleVerify = async () => {
  console.log('🚨 STARTING DEEP DEBUG VERIFICATION 🚨');
  
  try {
    if (!file || !signerAddress) return;

    const hash = await hashFile(file);
    console.log('📄 Document hash:', hash);

    // 1. VERIFICAR QUÉ HAY EN EL CONTRATO
    console.log('🔍 Checking contract state...');
    const documentInfo = await getDocumentInfo(hash);
    console.log('📋 RAW Contract document info:', documentInfo);
    
    if (!documentInfo || !documentInfo.exists) {
      console.log('❌ Document not found in contract');
      return;
    }

    console.log('✅ Document exists in contract');
    console.log('   - Stored signer:', documentInfo.signer);
    console.log('   - Expected signer:', signerAddress);
    console.log('   - Match:', documentInfo.signer.toLowerCase() === signerAddress.toLowerCase());

    // 2. VERIFICAR LA FIRMA LOCALMENTE CON DIFERENTES MÉTODOS
    console.log('🔐 Testing signature recovery locally...');
    
    const wallet = anvilWallets.find(w => w.account.address.toLowerCase() === signerAddress.toLowerCase());
    if (!wallet) throw new Error('Wallet not found');
     
    
    
          if (documentInfo.exists) {
      console.log('🎉 VERIFICATION SUCCESSFUL!');
      console.log("receipt" ,blockHash)
      setVerificationResult({
        

        isValid: true,
        details: {
          hash: documentInfo.hash,
          signer: documentInfo.signer,
          timestamp: documentInfo.timestamp,
          documentName: file.name,
          documentSize: file.size,
          documentType: file.type || 'application/octet-stream',
          transactionHash: blockHash
        },
        error: null
      });
    } else {
      console.log('❌ ALL VERIFICATION METHODS FAILED');
      setVerificationResult({
        isValid: false,
        details: { 
          hash, 
          signer: documentInfo.signer, 
          timestamp: documentInfo.timestamp, 
          documentName: file.name,
          documentSize: file.size,
          documentType: file.type || 'application/octet-stream', 
          transactionHash: blockHash 
        },
        error: 'All signature verification methods failed'
      });
    }

  } catch (err) {
    console.error('💥 Verification error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    setVerificationResult({
      isValid: false,
      details: null,
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
          Document Registry & Verification
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Upload a document, register it on blockchain, and verify its digital signature.
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

      {/* Registration Status */}
      {registrationResult.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 font-medium">Registration Failed</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{registrationResult.error}</p>
        </div>
      )}

      {registrationResult.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800 font-medium">Registration Successful!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">Document registered on blockchain. You can now verify it.</p>
        </div>
      )}

      {!registrationResult.success && file && signerAddress && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-800 font-medium">Document Not Registered</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            You need to register the document on blockchain before verifying it.
          </p>
        </div>
      )}

      {verificationResult.isValid !== null && (
        <VerificationResult result={verificationResult} />
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={handleRegisterDocument}
            disabled={!file || !signerAddress || isRegistering || isVerifying}
            className="btn btn-secondary px-6 py-3 flex items-center space-x-2 transition-all duration-200 hover:shadow-lg"
          >
            {isRegistering ? (
              <>
                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              <>
                Register Document
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleVerify}
          disabled={!file || !signerAddress || isVerifying || isRegistering}
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