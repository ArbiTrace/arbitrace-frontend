import { motion } from 'framer-motion';
import { Shield, AlertTriangle, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTradingStore } from '@/stores';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface RiskMetric {
  label: string;
  current: number;
  limit: number;
  icon: React.ElementType;
  format: 'currency' | 'percent' | 'number';
}

// ============================================================================
// Helper Functions
// ============================================================================

function getRiskLevel(percentage: number): {
  level: 'safe' | 'caution' | 'warning' | 'danger';
  color: string;
  textColor: string;
} {
  if (percentage < 50) {
    return {
      level: 'safe',
      color: 'bg-success',
      textColor: 'text-success',
    };
  }
  if (percentage < 75) {
    return {
      level: 'caution',
      color: 'bg-info',
      textColor: 'text-info',
    };
  }
  if (percentage < 90) {
    return {
      level: 'warning',
      color: 'bg-warning',
      textColor: 'text-warning',
    };
  }
  return {
    level: 'danger',
    color: 'bg-destructive',
    textColor: 'text-destructive',
  };
}

function formatValue(value: number, format: RiskMetric['format']): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    case 'number':
      return value.toFixed(2);
    default:
      return String(value);
  }
}

// ============================================================================
// Sub-Components
// ============================================================================

function GaugeChart({
  percentage,
  size = 80,
}: {
  percentage: number;
  size?: number;
}) {
  const risk = getRiskLevel(percentage);
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          fill="none"
          stroke="hsl(var(--color-secondary))"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 8}
          fill="none"
          stroke={`hsl(var(--color-${risk.level === 'safe' ? 'success' : risk.level === 'danger' ? 'destructive' : risk.level === 'warning' ? 'warning' : 'info'}))`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn('text-lg font-mono font-bold', risk.textColor)}>
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

function RiskMetricItem({ metric }: { metric: RiskMetric }) {
  const percentage = (metric.current / metric.limit) * 100;
  const risk = getRiskLevel(percentage);
  const MetricIcon = metric.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              risk.level === 'safe' && 'bg-success/10',
              risk.level === 'caution' && 'bg-info/10',
              risk.level === 'warning' && 'bg-warning/10',
              risk.level === 'danger' && 'bg-destructive/10'
            )}
          >
            <MetricIcon
              className={cn(
                'h-4 w-4',
                risk.level === 'safe' && 'text-success',
                risk.level === 'caution' && 'text-info',
                risk.level === 'warning' && 'text-warning',
                risk.level === 'danger' && 'text-destructive'
              )}
            />
          </div>
          <div>
            <p className="text-sm font-medium">{metric.label}</p>
            <p className="text-xs text-muted-foreground">
              {formatValue(metric.current, metric.format)} /{' '}
              {formatValue(metric.limit, metric.format)}
            </p>
          </div>
        </div>
        <GaugeChart percentage={Math.min(percentage, 100)} size={64} />
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <Progress
          value={Math.min(percentage, 100)}
          className={cn(
            'h-2',
            risk.level === 'safe' && '[&>div]:bg-success',
            risk.level === 'caution' && '[&>div]:bg-info',
            risk.level === 'warning' && '[&>div]:bg-warning',
            risk.level === 'danger' && '[&>div]:bg-destructive'
          )}
        />
        <p className="text-xs text-muted-foreground text-right">
          {percentage.toFixed(1)}% utilized
        </p>
      </div>

      {/* Warning Message */}
      {percentage >= 75 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={cn(
            'flex items-center gap-2 p-2 rounded-lg text-xs',
            percentage >= 90
              ? 'bg-destructive/10 text-destructive'
              : 'bg-warning/10 text-warning'
          )}
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>
            {percentage >= 90
              ? 'Critical: Approaching limit'
              : 'Warning: High utilization'}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function RiskMonitor() {
  const { portfolio, agentStatus } = useTradingStore();

  const riskMetrics: RiskMetric[] = [
    {
      label: 'Position Size',
      current: portfolio.currentPositionSize || 0,
      limit: agentStatus.config?.maxPositionSize || 1000,
      icon: Activity,
      format: 'currency',
    },
    {
      label: 'Daily Loss',
      current: Math.abs(Math.min(portfolio.dailyPnL, 0)),
      limit: agentStatus.config?.maxDailyLoss || 100,
      icon: TrendingDown,
      format: 'currency',
    },
    {
      label: 'Portfolio Exposure',
      current: (portfolio.totalExposure || 0) * 100,
      limit: 30, // 30% max exposure
      icon: Shield,
      format: 'percent',
    },
  ];

  const overallRiskScore =
    riskMetrics.reduce(
      (acc, metric) => acc + (metric.current / metric.limit) * 100,
      0
    ) / riskMetrics.length;

  const riskLevel = getRiskLevel(overallRiskScore);

  return (
    <Card className="glass-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Risk Monitor
            </CardTitle>
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-medium',
                riskLevel.level === 'safe' && 'bg-success/10 text-success',
                riskLevel.level === 'caution' && 'bg-info/10 text-info',
                riskLevel.level === 'warning' && 'bg-warning/10 text-warning',
                riskLevel.level === 'danger' && 'bg-destructive/10 text-destructive'
              )}
            >
              {riskLevel.level.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/50">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Overall Risk Score
            </p>
            <p
              className={cn('text-2xl font-mono font-bold', riskLevel.textColor)}
            >
              {overallRiskScore.toFixed(1)}%
            </p>
          </div>
          <GaugeChart percentage={overallRiskScore} size={80} />
        </div>

        {/* Individual Metrics */}
        <div className="space-y-6">
          {riskMetrics.map((metric) => (
            <RiskMetricItem key={metric.label} metric={metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}