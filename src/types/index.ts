// ArbiTrace Type Definitions - Updated with AI Features

// ============================================================================
// Trade Types
// ============================================================================

export interface Trade {
  id: string;
  timestamp: number;
  pair: string;
  type: 'cex-to-dex' | 'dex-to-cex';
  amountIn: string; // Changed to string for BigInt support
  amountInToken: string;
  amountOut: string; // Changed to string for BigInt support
  amountOutToken: string;
  profit: string; // Changed to string for BigInt support
  profitPercent: number;
  gasUsed: number;
  gasCost: string; // Changed to string for BigInt support
  executionTime: number;
  slippage: number;
  status: 'pending' | 'success' | 'failed';
  txHash: string;
  aiConfidence?: number; // NEW: AI confidence score (0-100)
  aiReasoning?: string; // NEW: AI explanation for trade
}

// ============================================================================
// Opportunity Types
// ============================================================================

export interface Opportunity {
  id: string;
  timestamp: number;
  pair: string;
  cexPrice: number;
  dexPrice: number;
  spread: number;
  estimatedProfit?: number; // Made optional
  estimatedGas: number;
  netProfit: number;
  confidence: number;
  status: 'detected' | 'analyzing' | 'ai_approved' | 'executing' | 'completed' | 'rejected'; // Added 'ai_approved'
  aiReasoning?: string;
  aiDecision?: AIDecision; // NEW: Full AI decision object
  riskScore: number;
}

// ============================================================================
// AI Types (NEW)
// ============================================================================

export interface AIDecision {
  id: string;
  timestamp: number;
  shouldExecute: boolean;
  confidence: number;
  reasoning: string;
  riskAssessment: string;
}

export interface AIInsights {
  lastDecision: AIDecision | null;
  lastPerformanceAnalysis: string;
  averageConfidence: number;
}

export interface SkippedTrade {
  id: string;
  timestamp: number;
  pair: string;
  reason: 'AI rejected' | 'Low confidence' | 'High risk' | 'Insufficient spread';
  aiReasoning?: string;
  confidence?: number;
  spread: number;
  cexPrice?: number;
  dexPrice?: number;
}

// ============================================================================
// Strategy Types
// ============================================================================

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
  // NEW: AI-related settings
  aiEnabled?: boolean;
  minAIConfidence?: number; // Minimum AI confidence to execute (default 70)
}

// ============================================================================
// Agent Status Types
// ============================================================================

export interface AgentStatus {
  status: 'active' | 'paused' | 'error' | 'initializing';
  uptime: number;
  lastUpdate: number; // NEW
  currentStrategy?: string; // NEW
  totalTrades: number; // NEW
  successfulTrades: number; // NEW
  skippedTrades?: number; // NEW: Trades skipped by AI
  totalProfit: string; // NEW: Changed to string for BigInt
  errors: string[];
  aiResponseTime: number;
  aiEngine?: string; // NEW: e.g., "Google Gemini 3 Flash"
  lastTradeTime?: number;
}

// ============================================================================
// Portfolio Types
// ============================================================================

export interface Portfolio {
  totalValue: number;
  vaultBalance: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  weeklyPnL: number;
  weeklyPnLPercent: number;
  monthlyPnL: number;
  monthlyPnLPercent: number;
  currentPositionSize?: number; // NEW
  totalExposure?: number; // NEW
  positions: Position[];
}

export interface Position {
  token: string;
  symbol: string;
  amount: number;
  value: number;
  allocation: number;
}

// ============================================================================
// Performance Metrics Types
// ============================================================================

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
  // NEW: AI-specific metrics
  avgAIConfidence?: number;
  aiApprovalRate?: number; // % of opportunities AI approved
  aiWinRate?: number; // Win rate of AI-approved trades
}

// ============================================================================
// Backtest Types
// ============================================================================

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

// ============================================================================
// Chart & Data Types
// ============================================================================

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

// ============================================================================
// Filter Types
// ============================================================================

export interface TradeFilters {
  pair?: string;
  status?: Trade['status'];
  dateFrom?: number;
  dateTo?: number;
  search?: string;
  minProfit?: number; // NEW
  maxProfit?: number; // NEW
  minAIConfidence?: number; // NEW
}

// ============================================================================
// Settings Types
// ============================================================================

export interface NotificationSettings {
  tradeExecution: boolean;
  riskWarnings: boolean;
  dailySummary: boolean;
  priceAlerts: boolean;
  aiDecisions?: boolean; // NEW: Notify on AI decisions
  skippedTrades?: boolean; // NEW: Notify when trades are skipped
}

export interface DisplaySettings {
  theme: 'dark' | 'light';
  currency: 'USD' | 'EUR' | 'CRO';
  chartType: 'area' | 'line' | 'candle';
  showAIInsights?: boolean; // NEW: Show AI reasoning in UI
  showSkippedTrades?: boolean; // NEW: Show skipped trades
}

// ============================================================================
// Network Types
// ============================================================================

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  isTestnet: boolean;
}

// ============================================================================
// WebSocket Event Types (NEW)
// ============================================================================

export interface WebSocketEvents {
  // Agent events
  'agent:status': AgentStatus;
  'agent:status_changed': AgentStatus;
  'agent:started': void;
  'agent:stopped': void;
  
  // Opportunity events
  'opportunity:detected': Opportunity;
  'opportunities:initial': Opportunity[];
  
  // Trade events
  'trade:executing': Trade;
  'trade:completed': Trade;
  'trade:skipped': SkippedTrade;
  'trades:initial': Trade[];
  
  // Portfolio events
  'portfolio:updated': Portfolio;
  
  // AI events
  'ai:decision': AIDecision;
  'ai:insights': AIInsights;
  
  // Risk events
  'risk:warning': {
    type: 'exposure' | 'loss' | 'volatility' | 'gas';
    message: string;
    severity: 'low' | 'medium' | 'high';
    timestamp: number;
  };
  
  // Error events
  'error': {
    message: string;
    code?: string;
  };
}

// ============================================================================
// API Response Types (NEW)
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Helper Types
// ============================================================================

export type SortDirection = 'asc' | 'desc';
export type SortField = 'timestamp' | 'profit' | 'confidence' | 'spread';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}