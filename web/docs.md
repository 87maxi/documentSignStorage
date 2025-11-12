# Document Verification DApp

## Overview

This is a decentralized application (DApp) that allows users to verify the authenticity of document signatures stored on the blockchain. The application uses Next.js with TypeScript, Tailwind CSS, and a suite of blockchain tools including wagmi, viem, and RainbowKit for wallet integration.

## Features

- **Wallet Integration**: Connect to MetaMask and other EVM-compatible wallets using RainbowKit
- **Document Hash Verification**: Calculate SHA-256 hash of documents and verify their authenticity on the blockchain
- **Responsive Design**: Mobile-first design that works across all device sizes
- **Real-time Verification**: Check document signatures against the DocumentVerification smart contract
- **User-friendly Interface**: Drag-and-drop file upload with visual feedback

## Technology Stack

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React**: Component-based UI library

### Blockchain
- **wagmi**: React hooks for Ethereum that simplify wallet connections
- **viem**: Type-safe, high-performance Ethereum client
- **RainbowKit**: Wallet connection UI for decentralized applications
- **Ethers.js**: Comprehensive library for interacting with the Ethereum blockchain

## Smart Contract

The application interacts with the DocumentVerification smart contract, which provides the following functionality:

- `storeDocumentHash(bytes32 _hash, address _signer)`: Stores a document hash with its signer
- `verifyDocument(bytes32 _hash, address _signer)`: Verifies if a document hash matches the expected signer
- `getDocumentInfo(bytes32 _hash)`: Retrieves detailed information about a document
- `hasDocument(address _user, bytes32 _hash)`: Checks if a user has a specific document

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── DocumentVerification.tsx
│   │   ├── FileSelector.tsx
│   │   ├── SignerAddressInput.tsx
│   │   ├── VerificationResult.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── wagmi.ts
│       └── contract.ts
├── contracts/
│   └── DocumentVerification.sol
├── artifacts/
│   └── contracts/
│       └── DocumentVerification.sol/
│           └── DocumentVerification.json
├── .env
├── jest.config.js
├── jest.setup.js
├── next.config.ts
├── package.json
└── docs.md
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

The application includes comprehensive unit tests for all components:

- `FileSelector.test.tsx`: Tests file upload functionality including drag-and-drop and click-to-upload
- `SignerAddressInput.test.tsx`: Tests signer address input and validation
- `VerificationResult.test.tsx`: Tests verification result display
- `DocumentVerification.test.tsx`: Integration test for the main component

Run tests with: `npm test`

## Deployment

The application can be deployed to Vercel, Netlify, or any static hosting service that supports Next.js applications.

## Security Considerations

- All document hashes are calculated client-side to maintain privacy
- The application uses secure SHA-256 hashing algorithm
- Input validation is performed on both client and smart contract levels
- Proper error handling prevents information leakage

## Future Enhancements

- Add document storage to IPFS or similar decentralized storage
- Implement document signing functionality
- Add support for multiple blockchain networks
- Implement document versioning and revocation
- Add user profile and document management
- Implement advanced search and filtering capabilities