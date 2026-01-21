// ============================================================================
// ArbiTrace Smart Contracts Configuration
// ============================================================================

import { Address } from 'viem';

// ============================================================================
// Network Configuration
// ============================================================================

export const NETWORKS = {
  mainnet: {
    id: 25,
    name: 'Cronos Mainnet',
    rpcUrl: 'https://evm.cronos.org',
    blockExplorer: 'https://explorer.cronos.org/mainnet',
  },
  testnet: {
    id: 338,
    name: 'Cronos Testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    blockExplorer: 'https://explorer.cronos.org/testnet',
  },
} as const;

// ============================================================================
// Contract Addresses
// ============================================================================

export const CONTRACTS = {
  mainnet: {
    vault:
      (import.meta.env.VITE_VAULT_ADDRESS as Address) ||
      '0x0000000000000000000000000000000000000000',
    router:
      (import.meta.env.VITE_ROUTER_ADDRESS as Address) ||
      '0x0000000000000000000000000000000000000000',
    x402Settler:
      (import.meta.env.VITE_X402_SETTLER_ADDRESS as Address) ||
      '0x0000000000000000000000000000000000000000',
  },
  testnet: {
    vault:
      (import.meta.env.VITE_TESTNET_VAULT_ADDRESS as Address) ||
      '0x3200dA9D020B77EbB9Ce4C73eFDd97E826C8Fb5c',
    router:
      (import.meta.env.VITE_TESTNET_ROUTER_ADDRESS as Address) ||
      '0xfE59389803aB4242A65059056cCd85Eec88f70D3',
    x402Settler:
      (import.meta.env.VITE_TESTNET_X402_SETTLER_ADDRESS as Address) ||
      '0x5b7B948D3Ffd6147a4A662632387159D1A1c6dA4',
  },
} as const;

export const TOKENS = {
  mainnet: {
    USDC: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59' as Address,
    WCRO: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23' as Address,
  },
  testnet: {
    USDC: '0x871be6C64c961DE141De862CBdD27DDeBB9DeCd7' as Address,
    WCRO: '0xa9d4b4f1AE414aDF72136A6aA4beb6CE466ADEB0' as Address,
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

export function getNetwork() {
  const isTestnet = true; // Set to true for testnet, false for mainnet
  return isTestnet ? 'testnet' : 'mainnet';
}

export function getContracts() {
  const network = getNetwork();
  return CONTRACTS[network];
}

export function getTokens() {
  const network = getNetwork();
  return TOKENS[network];
}

export function getNetworkConfig() {
  const network = getNetwork();
  return NETWORKS[network];
}

// ============================================================================
// Token Metadata
// ============================================================================

export const TOKEN_METADATA = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18,
    logo: '/tokens/usdc.svg',
  },
  WCRO: {
    symbol: 'WCRO',
    name: 'Wrapped CRO',
    decimals: 18,
    logo: '/tokens/wcro.svg',
  },
} as const;

// ============================================================================
// Constants
// ============================================================================

export const APPROVAL_AMOUNT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'; // Max uint256
export const DEFAULT_GAS_LIMIT = 500000n;
export const REFRESH_INTERVAL = 10000; // 10 seconds