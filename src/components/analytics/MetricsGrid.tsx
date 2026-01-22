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
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  delay?: number;
}

const MetricCard = ({ title, value, icon, trend, description, delay = 0 }: MetricCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="glass-card p-4 rounded-xl"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className={cn(
          'p-2 rounded-lg',
          trend === 'up' && 'bg-success/10 text-success',
          trend === 'down' && 'bg-destructive/10 text-destructive',
          trend === 'neutral' && 'bg-primary/10 text-primary'
        )}>
          {icon}
        </div>
      </div>
      <p className={cn(
        'font-mono text-2xl font-bold',
        trend === 'up' && 'text-success',
        trend === 'down' && 'text-destructive',
        trend === 'neutral' && 'text-foreground'
      )}>
        {value}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </motion.div>
  );
};

export const MetricsGrid = () => {
  const { performanceMetrics } = useTradingStore();

  const metrics: MetricCardProps[] = [
    {
      title: 'Total Return',
      value: formatCurrency(performanceMetrics.totalReturn),
      icon: <TrendingUp className="w-4 h-4" />,
      trend: performanceMetrics.totalReturn >= 0 ? 'up' : 'down',
      description: formatPercent(performanceMetrics.totalReturnPercent),
    },
    {
      title: 'Win Rate',
      value: formatPercent(performanceMetrics.winRate),
      icon: <Target className="w-4 h-4" />,
      trend: 'neutral',
      description: `${performanceMetrics.profitableTrades}/${performanceMetrics.totalTrades} trades`,
    },
    {
      title: 'Sharpe Ratio',
      value: performanceMetrics.sharpeRatio.toFixed(2),
      icon: <Gauge className="w-4 h-4" />,
      trend: performanceMetrics.sharpeRatio >= 2 ? 'up' : 'neutral',
      description: performanceMetrics.sharpeRatio >= 2 ? 'Excellent' : 'Good',
    },
    {
      title: 'Max Drawdown',
      value: formatPercent(performanceMetrics.maxDrawdown),
      icon: <TrendingDown className="w-4 h-4" />,
      trend: 'down',
      description: 'Maximum peak-to-trough decline',
    },
    {
      title: 'Profit Factor',
      value: performanceMetrics.profitFactor.toFixed(2),
      icon: <BarChart3 className="w-4 h-4" />,
      trend: performanceMetrics.profitFactor >= 1.5 ? 'up' : 'neutral',
      description: 'Gross profit / Gross loss',
    },
    {
      title: 'Avg Trade Profit',
      value: formatCurrency(performanceMetrics.avgTradeProfit),
      icon: <Activity className="w-4 h-4" />,
      trend: performanceMetrics.avgTradeProfit >= 0 ? 'up' : 'down',
    },
    {
      title: 'Best Trade',
      value: formatCurrency(performanceMetrics.bestTrade),
      icon: <Award className="w-4 h-4" />,
      trend: 'up',
    },
    {
      title: 'Worst Trade',
      value: formatCurrency(performanceMetrics.worstTrade),
      icon: <AlertTriangle className="w-4 h-4" />,
      trend: 'down',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} {...metric} delay={index} />
      ))}
    </div>
  );
};
