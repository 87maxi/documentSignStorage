"use client"
import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

type FileHashState = {
  hash: string;
  error: string | null;
  status: 'idle' | 'hashing' | 'success' | 'error';
};

export const useFileHash = () => {
  const [state, setState] = useState<FileHashState>({
    hash: '',
    error: null,
    status: 'idle'
  });

  const hashFile = useCallback(async (file: File): Promise<string> => {
    if (!file) {
      throw new Error('No file provided');
    }

    setState(prev => ({...prev, status: 'hashing', error: null}));

    try {
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => e.target?.result ? resolve(e.target.result as ArrayBuffer) : reject();
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
      });

      const hash = ethers.keccak256(new Uint8Array(arrayBuffer));
      
      setState({
        hash,
        error: null,
        status: 'success'
      });

      return hash;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Hashing failed';
      setState(prev => ({
        ...prev,
        error: message,
        status: 'error'
      }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      hash: '',
      error: null,
      status: 'idle'
    });
  }, []);

  return {
    ...state,
    hashFile,
    reset,
    isHashing: state.status === 'hashing',
    isSuccess: state.status === 'success',
    isError: state.status === 'error'
  };
};