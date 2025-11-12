import { useAccount } from 'wagmi';
import { useState } from 'react';
import  FileSelector  from './FileSelector';
import SignerAddressInput from './SignerAddressInput';
import VerificationResult from './VerificationResult';
import DocumentVerificationContract from '../lib/contract';

const DocumentVerification = () => {
  const { address } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState('');
  const [signerAddress, setSignerAddress] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    signer: string;
    timestamp: number;
    blockNumber: number;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSignerAddressChange = (event) => {
    setSignerAddress(event.target.value);
  };

  const handleVerify = async () => {
    if (!file || !signerAddress) {
      alert('Please select a file and enter a signer address.');
      return;
    }

    setIsVerifying(true);
    try {
      const contract = new DocumentVerificationContract(signerAddress);
      const result = await contract.verifyDocument(file);
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({
        isValid: false,
        signer: '',
        timestamp: 0,
        blockNumber: 0
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <h1>Document Verification</h1>
      <FileSelector onChange={handleFileChange} />
      <SignerAddressInput value={signerAddress} onChange={handleSignerAddressChange} />
      <button onClick={handleVerify}>Verify Document</button>
      <VerificationResult result={verificationResult} />
    </div>
  );
};

export default DocumentVerification;

