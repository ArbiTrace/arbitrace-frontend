import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Pause,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTradingStore } from '@/stores';
import { formatCurrency, formatPercent, formatCompact } from '@/utils/formatters';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  positive?: boolean;
  showTrend?: boolean;
  loading?: boolean;
}

// ============================================================================
// Sub-Components
// ============================================================================

function StatCard({ label, value, icon: Icon, positive, showTrend, loading }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="p-3 sm:p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />}
        <span className="font-medium">{label}</span>
      </div>
      
      {loading ? (
        <div className="h-6 bg-border/30 rounded animate-pulse" />
      ) : (
        <motion.div
          key={String(value)}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            'font-mono font-semibold text-base sm:text-lg flex items-center gap-1',
            showTrend && (positive ? 'text-success' : 'text-destructive')
          )}
        >
          {showTrend && (
            <motion.div
              initial={{ rotate: positive ? -45 : 45 }}
              animate={{ rotate: 0 }}
            >
              {positive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
            </motion.div>
          )}
          <span>{value}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  variant = 'outline',
  className,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: 'outline' | 'default';
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={cn('gap-2 group', className)}
    >
      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PortfolioOverview() {
  const { portfolio, agentStatus, toggleAgent, performanceMetrics } = useTradingStore();
  const [isValueVisible, setIsValueVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isProfit = portfolio.dailyPnL >= 0;
  const isActive = agentStatus.status === 'active';

  const handleToggleAgent = async () => {
    setIsLoading(true);
    try {
      await toggleAgent();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-hover border-glow overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-semibold">
                  Portfolio Overview
                </h2>
                <Badge
                  variant={isActive ? 'default' : 'secondary'}
                  className={cn(
                    'gap-1.5',
                    isActive && 'bg-success/10 text-success border-success/20'
                  )}
                >
                  <span
                    className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      isActive ? 'bg-success pulse-success' : 'bg-muted-foreground'
                    )}
                  />
                  {isActive ? 'Active' : 'Paused'}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsValueVisible(!isValueVisible)}
                className="h-8 w-8 p-0"
                aria-label={isValueVisible ? 'Hide balances' : 'Show balances'}
              >
                {isValueVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Main Value Display */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              Total Portfolio Value
            </p>
            
            <AnimatePresence mode="wait">
              {isValueVisible ? (
                <motion.div
                  key="visible"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.h1
                    key={portfolio.totalValue}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight"
                  >
                    {formatCurrency(portfolio.totalValue)}
                  </motion.h1>
                </motion.div>
              ) : (
                <motion.div
                  key="hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight"
                >
                  ••••••••
                </motion.div>
              )}
            </AnimatePresence>

            {/* 24h P&L Change */}
            {isValueVisible && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 flex-wrap"
              >
                <div
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    isProfit
                      ? 'bg-success/10 text-success hover:bg-success/20'
                      : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  )}
                >
                  {isProfit ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-mono font-semibold">
                    {isProfit ? '+' : ''}
                    {formatCurrency(portfolio.dailyPnL)}
                  </span>
                  <span className="text-xs opacity-80">
                    ({formatPercent(portfolio.dailyPnLPercent)})
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">24h change</span>
              </motion.div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Win Rate"
              value={formatPercent(performanceMetrics.winRate, 1)}
              icon={Activity}
              positive
            />
            <StatCard
              label="Total Trades"
              value={formatCompact(performanceMetrics.totalTrades)}
              icon={Zap}
            />
            <StatCard
              label="Weekly P&L"
              value={isValueVisible ? formatCurrency(portfolio.weeklyPnL) : '••••'}
              positive={portfolio.weeklyPnL >= 0}
              showTrend
              loading={!isValueVisible}
            />
            <StatCard
              label="Monthly P&L"
              value={isValueVisible ? formatCurrency(portfolio.monthlyPnL) : '••••'}
              positive={portfolio.monthlyPnL >= 0}
              showTrend
              loading={!isValueVisible}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
            <Button
              variant={isActive ? 'outline' : 'default'}
              size="sm"
              onClick={handleToggleAgent}
              disabled={isLoading}
              className={cn(
                'gap-2 font-medium',
                isActive
                  ? 'border-warning text-warning hover:bg-warning/10'
                  : 'bg-success hover:bg-success/90 text-success-foreground'
              )}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Activity className="h-4 w-4" />
                </motion.div>
              ) : isActive ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isActive ? 'Pause Agent' : 'Resume Agent'}</span>
            </Button>

            <QuickActionButton
              icon={Download}
              label="Deposit"
              onClick={() => console.log('Deposit')}
            />

            <QuickActionButton
              icon={ArrowUpRight}
              label="Withdraw"
              onClick={() => console.log('Withdraw')}
            />

            <QuickActionButton
              icon={Settings}
              label="Settings"
              onClick={() => console.log('Settings')}
              className="ml-auto"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}