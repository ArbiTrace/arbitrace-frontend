import { motion } from 'framer-motion';
import { useTradingStore } from '@/stores';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity, 
  BarChart3,
  Award,
  AlertTriangle,
  Gauge,
  Brain,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  delay?: number;
  highlight?: boolean;
}

const MetricCard = ({ title, value, icon, trend, description, delay = 0, highlight }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "glass-card p-4 rounded-xl transition-all duration-300",
        highlight && "ring-2 ring-primary/30"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className={cn(
          'p-2 rounded-lg transition-colors',
          trend === 'up' && 'bg-success/10 text-success',
          trend === 'down' && 'bg-destructive/10 text-destructive',
          trend === 'neutral' && 'bg-primary/10 text-primary'
        )}>
          {icon}
        </div>
      </div>
      <motion.p 
        key={value}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className={cn(
          'font-mono text-2xl font-bold transition-colors',
          trend === 'up' && 'text-success',
          trend === 'down' && 'text-destructive',
          trend === 'neutral' && 'text-foreground'
        )}
      >
        {value}
      </motion.p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </motion.div>
  );
};

export const MetricsGrid = () => {
  const { performanceMetrics, trades, agentStatus, aiInsights } = useTradingStore();

  // Calculate additional metrics from real trade data
  const computedMetrics = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalProfit: 0,
        avgProfit: 0,
        bestTrade: 0,
        worstTrade: 0,
        profitableTrades: 0,
      };
    }

    const profits = trades.map(t => parseFloat(t.profit || '0'));
    const profitable = profits.filter(p => p > 0);

    return {
      totalProfit: profits.reduce((sum, p) => sum + p, 0),
      avgProfit: profits.reduce((sum, p) => sum + p, 0) / profits.length,
      bestTrade: Math.max(...profits),
      worstTrade: Math.min(...profits),
      profitableTrades: profitable.length,
    };
  }, [trades]);

  const winRate = trades.length > 0 
    ? (computedMetrics.profitableTrades / trades.length) * 100 
    : performanceMetrics.winRate;

  const metrics: MetricCardProps[] = [
    {
      title: 'Total Return',
      value: formatCurrency(computedMetrics.totalProfit || performanceMetrics.totalReturn),
      icon: <TrendingUp className="w-4 h-4" />,
      trend: (computedMetrics.totalProfit || performanceMetrics.totalReturn) >= 0 ? 'up' : 'down',
      description: agentStatus.totalProfit 
        ? `Agent: ${formatCurrency(parseFloat(agentStatus.totalProfit))}`
        : formatPercent(performanceMetrics.totalReturnPercent),
      highlight: true,
    },
    {
      title: 'Win Rate',
      value: formatPercent(winRate),
      icon: <Target className="w-4 h-4" />,
      trend: 'neutral',
      description: `${computedMetrics.profitableTrades}/${trades.length || performanceMetrics.totalTrades} profitable`,
    },
    {
      title: 'AI Confidence',
      value: `${aiInsights.averageConfidence.toFixed(0)}%`,
      icon: <Brain className="w-4 h-4" />,
      trend: aiInsights.averageConfidence >= 75 ? 'up' : 'neutral',
      description: agentStatus.aiEngine || 'AI decision average',
    },
    {
      title: 'Sharpe Ratio',
      value: performanceMetrics.sharpeRatio.toFixed(2),
      icon: <Gauge className="w-4 h-4" />,
      trend: performanceMetrics.sharpeRatio >= 2 ? 'up' : 'neutral',
      description: performanceMetrics.sharpeRatio >= 2 ? 'Excellent' : performanceMetrics.sharpeRatio >= 1 ? 'Good' : 'Fair',
    },
    {
      title: 'Max Drawdown',
      value: formatPercent(performanceMetrics.maxDrawdown),
      icon: <TrendingDown className="w-4 h-4" />,
      trend: 'down',
      description: 'Peak-to-trough decline',
    },
    {
      title: 'Profit Factor',
      value: performanceMetrics.profitFactor.toFixed(2),
      icon: <BarChart3 className="w-4 h-4" />,
      trend: performanceMetrics.profitFactor >= 1.5 ? 'up' : 'neutral',
      description: performanceMetrics.profitFactor >= 2 ? 'Excellent' : 'Good',
    },
    {
      title: 'Avg Trade',
      value: formatCurrency(computedMetrics.avgProfit || performanceMetrics.avgTradeProfit),
      icon: <Activity className="w-4 h-4" />,
      trend: (computedMetrics.avgProfit || performanceMetrics.avgTradeProfit) >= 0 ? 'up' : 'down',
      description: `Per ${trades.length || performanceMetrics.totalTrades} trades`,
    },
    {
      title: 'Best Trade',
      value: formatCurrency(computedMetrics.bestTrade || performanceMetrics.bestTrade),
      icon: <Award className="w-4 h-4" />,
      trend: 'up',
      description: 'Largest single profit',
    },
    {
      title: 'Worst Trade',
      value: formatCurrency(computedMetrics.worstTrade || performanceMetrics.worstTrade),
      icon: <AlertTriangle className="w-4 h-4" />,
      trend: 'down',
      description: 'Largest single loss',
    },
    {
      title: 'Total Trades',
      value: (trades.length || performanceMetrics.totalTrades).toString(),
      icon: <Zap className="w-4 h-4" />,
      trend: 'neutral',
      description: `${agentStatus.successfulTrades || 0} successful`,
    },
  ];

  // Show empty state if no trades
  if (trades.length === 0 && performanceMetrics.totalTrades === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.slice(0, 4).map((metric, index) => (
          <div key={metric.title} className="glass-card p-4 rounded-xl opacity-50">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-muted-foreground">{metric.title}</span>
              <div className="p-2 rounded-lg bg-secondary/30">
                {metric.icon}
              </div>
            </div>
            <p className="font-mono text-2xl font-bold text-muted-foreground">--</p>
            <p className="text-xs text-muted-foreground mt-1">No data yet</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} {...metric} delay={index} />
      ))}
    </div>
  );
};