# Document Sign Storage

A decentralized document verification system using blockchain technology.

## Project Structure

```
.
├── contracts/          # Smart contracts
├── sc/                # Foundry development environment
└── web/               # Next.js frontend application
```

## Smart Contracts

The `contracts/` directory contains the main `DocumentVerification.sol` contract which provides:

- Document hash storage with metadata
- Verification against signer addresses
- Document existence checks
- User document listings

## Frontend Application

The `web/` directory contains a Next.js DApp for interacting with the document verification system.

### Features

- Wallet integration with RainbowKit
- Document upload and hashing
- On-chain document verification
- Document management dashboard
- Responsive UI with Tailwind CSS

### Getting Started

1. Navigate to the web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

See [web/README.md](web/README.md) for detailed frontend documentation.

## Development

### Smart Contract Development

The `sc/` directory contains the Foundry development environment for smart contracts with:

- Contract compilation
- Testing with Forge
- Deployment scripts

### Frontend Development

The frontend is built with:
- Next.js 13+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Wagmi for Ethereum hooks
- RainbowKit for wallet integration

## Documentation

- Smart contract documentation: See inline contract comments
- Frontend documentation: [web/docs.md](web/docs.md)

## License

MIT License