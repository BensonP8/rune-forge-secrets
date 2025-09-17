# Rune Forge Secrets

A secure, privacy-preserving crafting platform built with FHE (Fully Homomorphic Encryption) technology.

## Features

- **FHE-Encrypted Recipes**: All crafting recipes are encrypted using fully homomorphic encryption
- **Wallet Integration**: Secure wallet connection with multiple provider support
- **Privacy-First Design**: Your crafting secrets remain private and secure
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Technologies Used

This project is built with:

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Blockchain**: Ethereum (Sepolia testnet)
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **Wallet**: RainbowKit, Wagmi, Viem

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/BensonP8/rune-forge-secrets.git

# Navigate to the project directory
cd rune-forge-secrets

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

## Smart Contracts

The project includes FHE-enabled smart contracts for secure recipe storage and management:

- **RuneForgeSecrets.sol**: Main contract with FHE encryption for recipe data
- **Sepolia Testnet**: Deployed on Ethereum Sepolia testnet

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── WalletConnection.tsx
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── contracts/          # Smart contract files
```

## Security

This project implements FHE (Fully Homomorphic Encryption) to ensure that:

- Recipe data remains encrypted at all times
- Computations can be performed on encrypted data
- No sensitive information is exposed during processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub.