"use client"

import { useState } from 'react';
import { ethers } from 'ethers';

export const useFileHash = () => {
  const [fileHash, setFileHash] = useState<string>('');
  const [isHashing, setIsHashing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hashFile = async (file: File): Promise<string> => {
    if (!file) {
      throw new Error('No file provided');
    }
    
    try {
      setIsHashing(true);
      setError(null);
      
      // Create a reader to read the file as array buffer
      const reader = new FileReader();
      
      // Convert the array buffer to a proper hash using ethers
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as ArrayBuffer);
          } else {
            reject(new Error('File reading failed'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
      });
      
      // Convert ArrayBuffer to Uint8Array
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Use ethers to compute the keccak256 hash
      const hash = ethers.keccak256(uint8Array);
      
      setFileHash(hash);
      return hash;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsHashing(false);
    }
  };

  const clearHash = () => {
    setFileHash('');
    setError(null);
  };

  return {
    fileHash,
    isHashing,
    error,
    hashFile,
    clearHash
  };
};