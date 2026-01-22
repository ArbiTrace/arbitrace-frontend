import { NetworkConfig } from '@/types';

// Contract addresses (placeholders - update after deployment)
// Contract addresses (placeholders - update after deployment)
export const CONTRACTS = {
  VAULT: '0x52DB05b420b972E01CE42699902AAf471B493ee8',
  ROUTER: '0x141836fECB4cF237F7DD77Ac7DCEcf8B832E8504',
  X402_SETTLER: '0x3f12E90C3e911C4a4004FcC97A136A25842D422D',
} as const;

// Token addresses for Cronos
export const TOKENS = {
  USDC: '0x97E9a1300260946f9F23415446bE639C5bE0Ad54',
  WCRO: '0xf1bE638a1f4Cdbba0078256E54920b33D4639517',
} as const;

// Testnet token addresses
export const TESTNET_TOKENS = {
  USDC: '0x97E9a1300260946f9F23415446bE639C5bE0Ad54',
  WCRO: '0xf1bE638a1f4Cdbba0078256E54920b33D4639517',
} as const;

// Network configurations
export const NETWORKS: Record<string, NetworkConfig> = {
  cronos: {
    chainId: 25,
    name: 'Cronos Mainnet',
    rpcUrl: 'https://evm.cronos.org',
    explorerUrl: 'https://cronoscan.com',
    isTestnet: false,
  },
  cronosTestnet: {
    chainId: 338,
    name: 'Cronos Testnet',
    rpcUrl: 'https://evm-t3.cronos.org',
    explorerUrl: 'https://testnet.cronoscan.com',
    isTestnet: true,
  },
} as const;

// Supported token pairs for arbitrage
export const TOKEN_PAIRS = [
  { base: 'CRO', quote: 'USDC', symbol: 'CRO/USDC' },
  { base: 'ETH', quote: 'USDC', symbol: 'ETH/USDC' },
  { base: 'WBTC', quote: 'USDC', symbol: 'WBTC/USDC' },
  { base: 'VVS', quote: 'USDC', symbol: 'VVS/USDC' },
] as const;

// Default strategy presets
export const STRATEGY_PRESETS = {
  conservative: {
    minProfitThreshold: 0.008, // 0.8%
    maxPositionSize: 500,
    maxDailyLoss: 25,
    maxExposure: 0.2,
    stopLossPercent: 0.03,
    slippageTolerance: 0.01,
    consecutiveLossLimit: 3,
    volatilityThreshold: 0.15,
  },
  moderate: {
    minProfitThreshold: 0.005, // 0.5%
    maxPositionSize: 1000,
    maxDailyLoss: 50,
    maxExposure: 0.3,
    stopLossPercent: 0.05,
    slippageTolerance: 0.02,
    consecutiveLossLimit: 5,
    volatilityThreshold: 0.25,
  },
  aggressive: {
    minProfitThreshold: 0.003, // 0.3%
    maxPositionSize: 2500,
    maxDailyLoss: 100,
    maxExposure: 0.5,
    stopLossPercent: 0.08,
    slippageTolerance: 0.03,
    consecutiveLossLimit: 7,
    volatilityThreshold: 0.4,
  },
} as const;
