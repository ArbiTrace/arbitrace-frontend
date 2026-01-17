import { NetworkConfig } from '@/types';

// Contract addresses (placeholders - update after deployment)
export const CONTRACTS = {
  VAULT: '0x0000000000000000000000000000000000000000',
  ROUTER: '0x0000000000000000000000000000000000000000',
  X402_SETTLER: '0x0000000000000000000000000000000000000000',
} as const;

// Token addresses for Cronos
export const TOKENS = {
  USDC: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
  WCRO: '0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23',
} as const;

// Testnet token addresses
export const TESTNET_TOKENS = {
  USDC: '0x0000000000000000000000000000000000000000', // Placeholder
  WCRO: '0x0000000000000000000000000000000000000000', // Placeholder
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
