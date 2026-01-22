// ============================================================================
// ArbiTrace Smart Contracts Configuration
// ============================================================================

import { Address } from "viem";

// ============================================================================
// Network Configuration
// ============================================================================

export const NETWORKS = {
  mainnet: {
    id: 25,
    name: "Cronos Mainnet",
    rpcUrl: "https://evm.cronos.org",
    blockExplorer: "https://explorer.cronos.org/mainnet",
  },
  testnet: {
    id: 338,
    name: "Cronos Testnet",
    rpcUrl: "https://evm-t3.cronos.org",
    blockExplorer: "https://explorer.cronos.org/testnet",
  },
} as const;

// ============================================================================
// Contract Addresses
// ============================================================================

export const CONTRACTS = {
  mainnet: {
    vault:
      (import.meta.env.VITE_VAULT_ADDRESS as Address) ||
      "0x0000000000000000000000000000000000000000",
    router:
      (import.meta.env.VITE_ROUTER_ADDRESS as Address) ||
      "0x0000000000000000000000000000000000000000",
    x402Settler:
      (import.meta.env.VITE_X402_SETTLER_ADDRESS as Address) ||
      "0x0000000000000000000000000000000000000000",
  },
  testnet: {
    vault:
      (import.meta.env.VITE_TESTNET_VAULT_ADDRESS as Address) ||
      "0x52DB05b420b972E01CE42699902AAf471B493ee8",
    router:
      (import.meta.env.VITE_TESTNET_ROUTER_ADDRESS as Address) ||
      "0xfb27A06df0Bf61599943387e945A01034C8d2A6f",
    x402Settler:
      (import.meta.env.VITE_TESTNET_X402_SETTLER_ADDRESS as Address) ||
      "0xc33A285D162cfe0958D94191E9E82edD3cd58D3D",
  },
} as const;

export const TOKENS = {
  mainnet: {
    USDC: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59" as Address,
    WCRO: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23" as Address,
  },
  testnet: {
    USDC: "0x97E9a1300260946f9F23415446bE639C5bE0Ad54" as Address,
    WCRO: "0xf1bE638a1f4Cdbba0078256E54920b33D4639517" as Address,
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

export function getNetwork() {
  const isTestnet = true; // Set to true for testnet, false for mainnet
  return isTestnet ? "testnet" : "mainnet";
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
    symbol: "USDC",
    name: "USD Coin",
    decimals: 18,
    logo: "/tokens/usdc.svg",
  },
  WCRO: {
    symbol: "WCRO",
    name: "Wrapped CRO",
    decimals: 18,
    logo: "/tokens/wcro.svg",
  },
} as const;

// ============================================================================
// Constants
// ============================================================================

export const APPROVAL_AMOUNT =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"; // Max uint256
export const DEFAULT_GAS_LIMIT = 500000n;
export const REFRESH_INTERVAL = 10000; // 10 seconds
