// ArbiTrace Type Definitions

export interface Trade {
  id: string;
  timestamp: number;
  pair: string;
  type: 'cex-to-dex' | 'dex-to-cex';
  amountIn: number;
  amountInToken: string;
  amountOut: number;
  amountOutToken: string;
  profit: number;
  profitPercent: number;
  gasUsed: number;
  gasCost: number;
  executionTime: number;
  slippage: number;
  status: 'pending' | 'success' | 'failed';
  txHash: string;
  aiConfidence: number;
  aiReasoning?: string;
}

export interface Opportunity {
  id: string;
  timestamp: number;
  pair: string;
  cexPrice: number;
  dexPrice: number;
  spread: number;
  estimatedProfit: number;
  estimatedGas: number;
  netProfit: number;
  confidence: number;
  status: 'detected' | 'analyzing' | 'executing' | 'completed' | 'rejected';
  aiReasoning?: string;
  riskScore: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive' | 'custom';
  minProfitThreshold: number;
  maxPositionSize: number;
  maxDailyLoss: number;
  maxExposure: number;
  stopLossPercent: number;
  slippageTolerance: number;
  consecutiveLossLimit: number;
  volatilityThreshold: number;
  isActive: boolean;
}

export interface AgentStatus {
  status: 'active' | 'paused' | 'error';
  uptime: number;
  errors: string[];
  aiResponseTime: number;
  lastTradeTime?: number;
}

export interface Portfolio {
  totalValue: number;
  vaultBalance: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  weeklyPnL: number;
  weeklyPnLPercent: number;
  monthlyPnL: number;
  monthlyPnLPercent: number;
  positions: Position[];
}

export interface Position {
  token: string;
  symbol: string;
  amount: number;
  value: number;
  allocation: number;
}

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  winRate: number;
  totalTrades: number;
  profitableTrades: number;
  avgTradeProfit: number;
  bestTrade: number;
  worstTrade: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
}

export interface BacktestResult {
  startDate: number;
  endDate: number;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalReturnPercent: number;
  winRate: number;
  totalTrades: number;
  sharpeRatio: number;
  maxDrawdown: number;
  equityCurve: { timestamp: number; value: number }[];
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface GasPrice {
  slow: number;
  standard: number;
  fast: number;
  timestamp: number;
}

export type TimeRange = '1H' | '6H' | '24H' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

export interface TradeFilters {
  pair?: string;
  status?: Trade['status'];
  dateFrom?: number;
  dateTo?: number;
  search?: string;
}

export interface NotificationSettings {
  tradeExecution: boolean;
  riskWarnings: boolean;
  dailySummary: boolean;
  priceAlerts: boolean;
}

export interface DisplaySettings {
  theme: 'dark' | 'light';
  currency: 'USD' | 'EUR' | 'CRO';
  chartType: 'area' | 'line' | 'candle';
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  isTestnet: boolean;
}
