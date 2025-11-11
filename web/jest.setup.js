import '@testing-library/jest-dom'

// Mock TextEncoder/TextDecoder for viem
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Mock global crypto for Jest
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {
    subtle: {
      digest: async (algorithm, data) => {
        // Mock SHA-256 implementation for tests
        if (algorithm === 'SHA-256') {
          const hash = new Uint8Array(32).fill(0xab)
          return hash.buffer
        }
        throw new Error('Algorithm not supported in mock')
      }
    }
  }
}

// Mock window.crypto for browser environment
Object.defineProperty(window, 'crypto', {
  value: globalThis.crypto,
  writable: true
})

// Mock crypto.subtle for browser environment
Object.defineProperty(window.crypto, 'subtle', {
  value: globalThis.crypto.subtle,
  writable: true
})

// Mock File.arrayBuffer for Jest
if (typeof File.prototype.arrayBuffer === 'undefined') {
  File.prototype.arrayBuffer = function() {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsArrayBuffer(this)
    })
  }
}