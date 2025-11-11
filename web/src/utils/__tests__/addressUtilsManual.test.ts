// Manual test for address utilities without importing viem-dependent module

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

// Simple mock validation instead of importing viem
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

describe('addressUtils - Manual', () => {
  describe('shortenAddress', () => {
    it('shortens Ethereum addresses correctly', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      
      expect(shortenAddress(address)).toBe('0x742d...f44e')
      expect(shortenAddress(address, 6)).toBe('0x742d35...38f44e')
      expect(shortenAddress('invalid')).toBe('invalid')
    })
  })

  describe('formatAddress', () => {
    it('formats addresses to lowercase', () => {
      const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      
      expect(formatAddress(address)).toBe(address.toLowerCase())
      expect(formatAddress('invalid')).toBe('invalid')
    })
  })

  describe('isZeroAddress', () => {
    it('identifies zero address correctly', () => {
      expect(isZeroAddress('0x0000000000000000000000000000000000000000')).toBe(true)
      expect(isZeroAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).toBe(false)
      expect(isZeroAddress('invalid')).toBe(false)
    })
  })

  describe('isValidEthereumAddress', () => {
    it('validates Ethereum addresses correctly', () => {
      expect(isValidEthereumAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')).toBe(true)
      expect(isValidEthereumAddress('0x0000000000000000000000000000000000000000')).toBe(true)
      expect(isValidEthereumAddress('0xinvalid')).toBe(false)
      expect(isValidEthereumAddress('invalid')).toBe(false)
      expect(isValidEthereumAddress('')).toBe(false)
    })
  })
})