import { 
  Trade, 
  Opportunity, 
  Portfolio, 
  AgentStatus, 
  PerformanceMetrics, 
  ChartDataPoint,
  GasPrice,
  Strategy
} from '@/types';

// Generate realistic mock trades
export function generateMockTrades(count: number = 50): Trade[] {
  const pairs = ['CRO/USDC', 'ETH/USDC', 'WBTC/USDC', 'VVS/USDC'];
  const trades: Trade[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const isProfit = Math.random() > 0.24; // 76% win rate
    const profitPercent = isProfit 
      ? (Math.random() * 0.015 + 0.003) // 0.3% - 1.8% profit
      : -(Math.random() * 0.02 + 0.005); // 0.5% - 2.5% loss
    
    const amountIn = Math.floor(Math.random() * 2000 + 200);
    const profit = amountIn * profitPercent;
    const gasCost = Math.random() * 0.8 + 0.2;
    
    trades.push({
      id: `trade-${i}`,
      timestamp: now - (i * 1800000) - Math.random() * 900000, // Every ~30 mins
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      type: Math.random() > 0.5 ? 'cex-to-dex' : 'dex-to-cex',
      amountIn,
      amountInToken: 'USDC',
      amountOut: amountIn + profit - gasCost,
      amountOutToken: 'USDC',
      profit: profit - gasCost,
      profitPercent: (profit - gasCost) / amountIn,
      gasUsed: Math.floor(Math.random() * 100000 + 100000),
      gasCost,
      executionTime: Math.floor(Math.random() * 3000 + 1500),
      slippage: Math.random() * 0.005,
      status: Math.random() > 0.05 ? 'success' : 'failed',
      txHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`.slice(0, 66),
      aiConfidence: Math.floor(Math.random() * 25 + 70),
      aiReasoning: 'High confidence due to stable spread and low slippage risk',
    });
  }
  
  return trades.sort((a, b) => b.timestamp - a.timestamp);
}

// Generate live opportunities
export function generateMockOpportunities(count: number = 5): Opportunity[] {
  const pairs = ['CRO/USDC', 'ETH/USDC', 'WBTC/USDC', 'VVS/USDC'];
  const statuses: Opportunity['status'][] = ['detected', 'analyzing', 'executing'];
  const opportunities: Opportunity[] = [];
  
  for (let i = 0; i < count; i++) {
    const spread = Math.random() * 0.015 + 0.003;
    const estimatedProfit = (Math.random() * 15 + 3);
    const estimatedGas = Math.random() * 0.8 + 0.2;
    
    opportunities.push({
      id: `opp-${i}`,
      timestamp: Date.now() - (i * 60000),
      pair: pairs[Math.floor(Math.random() * pairs.length)],
      cexPrice: 0.085 + Math.random() * 0.005,
      dexPrice: 0.086 + Math.random() * 0.005,
      spread,
      estimatedProfit,
      estimatedGas,
      netProfit: estimatedProfit - estimatedGas,
      confidence: Math.floor(Math.random() * 30 + 65),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      riskScore: Math.floor(Math.random() * 40 + 10),
      aiReasoning: 'Market conditions favorable for arbitrage execution',
    });
  }
  
  return opportunities;
}

// Generate portfolio data
export function generateMockPortfolio(): Portfolio {
  const totalValue = 12450 + Math.random() * 500;
  const dailyPnL = 234.50 + (Math.random() - 0.5) * 100;
  
  return {
    totalValue,
    vaultBalance: totalValue * 0.8,
    dailyPnL,
    dailyPnLPercent: dailyPnL / totalValue,
    weeklyPnL: dailyPnL * 4.5,
    weeklyPnLPercent: (dailyPnL * 4.5) / totalValue,
    monthlyPnL: dailyPnL * 18,
    monthlyPnLPercent: (dailyPnL * 18) / totalValue,
    positions: [
      { token: 'USDC', symbol: 'USDC', amount: totalValue * 0.6, value: totalValue * 0.6, allocation: 0.6 },
      { token: 'CRO', symbol: 'CRO', amount: totalValue * 0.25 / 0.085, value: totalValue * 0.25, allocation: 0.25 },
      { token: 'ETH', symbol: 'ETH', amount: totalValue * 0.15 / 2200, value: totalValue * 0.15, allocation: 0.15 },
    ],
  };
}

// Generate agent status
export function generateMockAgentStatus(): AgentStatus {
  return {
    status: 'active',
    uptime: 86400 * 3 + Math.floor(Math.random() * 3600), // ~3 days
    errors: [],
    aiResponseTime: Math.floor(Math.random() * 50 + 80),
    lastTradeTime: Date.now() - Math.floor(Math.random() * 1800000),
  };
}

// Generate performance metrics
export function generateMockPerformanceMetrics(): PerformanceMetrics {
  return {
    totalReturn: 2845.50,
    totalReturnPercent: 0.285,
    winRate: 0.763,
    totalTrades: 847,
    profitableTrades: 646,
    avgTradeProfit: 3.36,
    bestTrade: 45.20,
    worstTrade: -28.50,
    sharpeRatio: 2.34,
    maxDrawdown: -0.042,
    profitFactor: 1.89,
  };
}

// Generate P&L chart data for different time ranges
export function generatePnLChartData(range: string = '24H'): ChartDataPoint[] {
  const now = Date.now();
  const data: ChartDataPoint[] = [];
  
  let points: number;
  let interval: number;
  
  switch (range) {
    case '1H':
      points = 12;
      interval = 5 * 60 * 1000; // 5 min
      break;
    case '6H':
      points = 24;
      interval = 15 * 60 * 1000; // 15 min
      break;
    case '24H':
      points = 48;
      interval = 30 * 60 * 1000; // 30 min
      break;
    case '1W':
      points = 28;
      interval = 6 * 60 * 60 * 1000; // 6 hours
      break;
    case '1M':
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    default:
      points = 48;
      interval = 30 * 60 * 1000;
  }
  
  let value = 10000;
  for (let i = points - 1; i >= 0; i--) {
    value += (Math.random() - 0.45) * 50; // Slight upward trend
    data.push({
      timestamp: now - (i * interval),
      value: Math.max(value, 9500),
    });
  }
  
  return data;
}

// Generate gas price data
export function generateMockGasPrice(): GasPrice {
  const base = Math.random() * 30 + 20;
  return {
    slow: base * 0.8,
    standard: base,
    fast: base * 1.3,
    timestamp: Date.now(),
  };
}

// Generate mock strategies
export function generateMockStrategies(): Strategy[] {
  return [
    {
      id: 'conservative',
      name: 'Conservative',
      description: 'Lower risk with steady, consistent returns. Best for capital preservation.',
      riskLevel: 'conservative',
      minProfitThreshold: 0.008,
      maxPositionSize: 500,
      maxDailyLoss: 25,
      maxExposure: 0.2,
      stopLossPercent: 0.03,
      slippageTolerance: 0.01,
      consecutiveLossLimit: 3,
      volatilityThreshold: 0.15,
      isActive: false,
    },
    {
      id: 'moderate',
      name: 'Balanced',
      description: 'Balanced approach with moderate risk and reward. Recommended for most users.',
      riskLevel: 'moderate',
      minProfitThreshold: 0.005,
      maxPositionSize: 1000,
      maxDailyLoss: 50,
      maxExposure: 0.3,
      stopLossPercent: 0.05,
      slippageTolerance: 0.02,
      consecutiveLossLimit: 5,
      volatilityThreshold: 0.25,
      isActive: true,
    },
    {
      id: 'aggressive',
      name: 'Aggressive',
      description: 'Higher risk for maximum returns. For experienced traders only.',
      riskLevel: 'aggressive',
      minProfitThreshold: 0.003,
      maxPositionSize: 2500,
      maxDailyLoss: 100,
      maxExposure: 0.5,
      stopLossPercent: 0.08,
      slippageTolerance: 0.03,
      consecutiveLossLimit: 7,
      volatilityThreshold: 0.4,
      isActive: false,
    },
  ];
}

// Generate hourly performance heatmap data
export function generateHourlyHeatmapData(): number[][] {
  const data: number[][] = [];
  for (let day = 0; day < 7; day++) {
    const dayData: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      // Higher performance during US/EU trading hours
      const basePerf = (hour >= 8 && hour <= 16) ? 0.6 : 0.3;
      dayData.push(basePerf + (Math.random() - 0.3) * 0.5);
    }
    data.push(dayData);
  }
  return data;
}

// Generate trade distribution data
export function generateTradeDistributionData(): { range: string; count: number; type: 'profit' | 'loss' }[] {
  return [
    { range: '-2% to -1.5%', count: 5, type: 'loss' },
    { range: '-1.5% to -1%', count: 12, type: 'loss' },
    { range: '-1% to -0.5%', count: 28, type: 'loss' },
    { range: '-0.5% to 0%', count: 45, type: 'loss' },
    { range: '0% to 0.5%', count: 120, type: 'profit' },
    { range: '0.5% to 1%', count: 180, type: 'profit' },
    { range: '1% to 1.5%', count: 95, type: 'profit' },
    { range: '1.5% to 2%', count: 35, type: 'profit' },
  ];
}

// Generate backtest result
import { BacktestResult } from '@/types';

export function generateBacktestResult(initialCapital: number): BacktestResult {
  const trades = Math.floor(Math.random() * 200 + 150);
  const winRate = 0.72 + Math.random() * 0.1;
  const avgProfit = initialCapital * 0.004;
  const totalReturn = trades * avgProfit * (winRate - 0.3);
  const finalCapital = initialCapital + totalReturn;
  
  // Generate equity curve
  const equityCurve: { timestamp: number; value: number }[] = [];
  const now = Date.now();
  const startDate = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
  let currentValue = initialCapital;
  
  for (let i = 0; i < 30; i++) {
    currentValue += (Math.random() - 0.4) * (initialCapital * 0.02);
    currentValue = Math.max(currentValue, initialCapital * 0.9);
    equityCurve.push({
      timestamp: startDate + i * 24 * 60 * 60 * 1000,
      value: currentValue,
    });
  }
  // Ensure final value matches
  equityCurve[equityCurve.length - 1].value = finalCapital;
  
  return {
    startDate,
    endDate: now,
    initialCapital,
    finalCapital,
    totalReturn,
    totalReturnPercent: totalReturn / initialCapital,
    winRate,
    totalTrades: trades,
    sharpeRatio: 1.8 + Math.random() * 0.8,
    maxDrawdown: -(0.03 + Math.random() * 0.03),
    equityCurve,
  };
}
