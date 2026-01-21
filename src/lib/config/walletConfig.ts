import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { cronos, cronosTestnet } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';

// ============================================================================
// Network Configuration
// ============================================================================

export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

if (!projectId) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set');
}

// Define Cronos networks
export const networks = [cronos, cronosTestnet];

// ============================================================================
// Wagmi Configuration
// ============================================================================

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false, // Set to true if using SSR
});

// ============================================================================
// AppKit Configuration
// ============================================================================

export const metadata = {
  name: 'ArbiTrace',
  description: 'AI-Powered Cross-Exchange Arbitrage Trading on Cronos',
  url: 'https://arbitrace.ai',
  icons: ['https://arbitrace.ai/logo.png'],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Enable analytics
    email: true, // Enable email login
    socials: ['google', 'github', 'apple'], // Social login options
    emailShowWallets: true, // Show wallet options in email flow
  },
  allWallets: 'SHOW', // Show all available wallets
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  ],
});

// ============================================================================
// Query Client
// ============================================================================

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// ============================================================================
// Export Wagmi Config
// ============================================================================

export const config = wagmiAdapter.wagmiConfig;