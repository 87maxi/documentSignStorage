# Document Sign & Storage - DApp Documentation

## Overview

Document Sign & Storage is a decentralized application (DApp) that allows users to verify and store document signatures on the blockchain. The application provides a secure, tamper-proof way to authenticate documents by storing their cryptographic hashes on the Ethereum blockchain.

## Features

### Core Functionality
- **Document Verification**: Verify the authenticity of documents by checking their hash against the blockchain
- **Secure Storage**: Store document hashes with timestamps and signatures
- **Blockchain Integration**: Leverage Ethereum blockchain for immutability and security
- **Wallet Connectivity**: Connect with popular Ethereum wallets (MetaMask, Coinbase Wallet, WalletConnect)

### User Interface Components

#### Header
- Branded header with application name and logo
- Responsive navigation menu
- Blockchain security indicator (green dot)

#### Document Verification Interface
- **File Selector**: Drag & drop interface for document upload with file preview
- **Signer Address Input**: Input field for Ethereum address or ENS name with:
  - Format validation
  - ENS resolution
  - Address history
  - Visual validation indicators
- **Verification Result**: Detailed display of verification results including:
  - Verification status
  - Document hash
  - Signer address
  - Block number and timestamp
  - Transaction details with Etherscan link

#### Footer
- Loading state with progress indicator
- Transaction details display
- Blockchain explorer links

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with responsive design
- **State Management**: React Hooks and Context API
- **Testing**: Jest, React Testing Library

### Web3 Integration
- **Wallet Connection**: wagmi with RainbowKit
- **Blockchain Interaction**: viem and ethers.js
- **Supported Chains**: Ethereum Mainnet and Sepolia Testnet
- **Providers**: Public provider for read operations

### Security Features
- SHA-256 hash calculation in-browser
- Ethereum address format validation
- ENS name resolution
- Transaction verification

## Development Setup

### Environment Variables
Create a `.env` file with the following variables:
```
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_INFURA_API_KEY=
```

### Scripts
- `dev`: Start development server
- `build`: Create production build
- `start`: Start production server
- `lint`: Run ESLint
- `test`: Run Jest tests
- `test:watch`: Run tests in watch mode

## Component Structure

```
src/
├── components/
│   ├── DocumentVerification.tsx
│   ├── FileSelector.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── SignerAddressInput.tsx
│   └── VerificationResult.tsx
├── lib/
│   ├── contract.ts
│   └── wagmi.ts
├── utils/
├── app/
│   ├── layout.tsx
│   └── page.tsx
└── types/
```

## Testing

Comprehensive unit tests are implemented for all components using Jest and React Testing Library:
- `FileSelector.test.tsx`: Tests for file upload, drag & drop, and validation
- `SignerAddressInput.test.tsx`: Tests for address validation, ENS resolution, and history
- `VerificationResult.test.tsx`: Tests for result display and status rendering
- `DocumentVerification.test.tsx`: Integration tests for the main verification flow

## Contract Integration

The DApp interfaces with a smart contract that provides the following methods:
- `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes signature)`
- `verifyDocument(bytes32 hash, address signer, bytes signature)`
- `getDocumentInfo(bytes32 hash)`
- `hasDocument(address user, bytes32 hash)`

## Responsive Design

The application is fully responsive and works across:
- Desktop (≥768px)
- Tablet (640px - 767px)
- Mobile (<640px)

All components adapt to different screen sizes with Tailwind CSS utility classes.

## Accessibility

The application follows web accessibility best practices:
- Semantic HTML structure
- Proper ARIA labels and roles
- Keyboard navigation support
- Sufficient color contrast
- Responsive and scalable text

## Deployment

The application can be deployed to Vercel, Netlify, or any platform that supports Next.js applications. Environment variables must be configured in the deployment platform.
