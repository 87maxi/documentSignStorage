import { ethers } from 'ethers'

export function isValidEthereumAddress(address: string): boolean {
  return ethers.isAddress(address)
}

export function shortenAddress(address: string, chars = 4): string {
  if (!isValidEthereumAddress(address)) return address
  
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

export function formatAddress(address: string): string {
  if (!isValidEthereumAddress(address)) return address
  
  // Basic checksum formatting
  return address.toLowerCase()
}

export function isZeroAddress(address: string): boolean {
  return address === '0x0000000000000000000000000000000000000000'
}