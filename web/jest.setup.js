import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => require('next-router-mock'));

// Mock fetch
if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch');
}

// Add any other global setup here
console.error = jest.fn();
console.warn = jest.fn();
