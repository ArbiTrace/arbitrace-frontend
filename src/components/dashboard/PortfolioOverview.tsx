import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap, Pause, Play, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTradingStore } from '@/stores';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export function PortfolioOverview() {
  const { portfolio, agentStatus, toggleAgent, performanceMetrics } = useTradingStore();
  const isProfit = portfolio.dailyPnL >= 0;

  return (
    <Card className="glass-hover border-glow overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Portfolio Value */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Total Portfolio Value</p>
            <motion.div
              key={portfolio.totalValue}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl lg:text-5xl font-mono font-bold tracking-tight">
                {formatCurrency(portfolio.totalValue)}
              </h1>
            </motion.div>
            <div className="flex items-center gap-2 mt-2">
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
                  isProfit 
                    ? 'bg-success/10 text-success' 
                    : 'bg-destructive/10 text-destructive'
                )}
              >
                {isProfit ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-mono">
                  {formatCurrency(Math.abs(portfolio.dailyPnL))}
                </span>
                <span>({formatPercent(portfolio.dailyPnLPercent)})</span>
              </div>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </div>

          {/* Middle: Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Win Rate"
              value={formatPercent(performanceMetrics.winRate - 1, 1)}
              icon={Activity}
              positive
            />
            <StatCard
              label="Total Trades"
              value={performanceMetrics.totalTrades.toLocaleString()}
              icon={Zap}
            />
            <StatCard
              label="Weekly P&L"
              value={formatCurrency(portfolio.weeklyPnL)}
              positive={portfolio.weeklyPnL >= 0}
              showTrend
            />
            <StatCard
              label="Monthly P&L"
              value={formatCurrency(portfolio.monthlyPnL)}
              positive={portfolio.monthlyPnL >= 0}
              showTrend
            />
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={agentStatus.status === 'active' ? 'outline' : 'default'}
              size="sm"
              onClick={toggleAgent}
              className={cn(
                'gap-2',
                agentStatus.status === 'active' 
                  ? 'border-warning text-warning hover:bg-warning/10' 
                  : 'bg-success hover:bg-success/90 text-success-foreground'
              )}
            >
              {agentStatus.status === 'active' ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Resume
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              Deposit
            </Button>
            <Button variant="outline" size="sm">
              Withdraw
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ElementType;
  positive?: boolean;
  showTrend?: boolean;
}

function StatCard({ label, value, icon: Icon, positive, showTrend }: StatCardProps) {
  return (
    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className={cn(
        'font-mono font-semibold flex items-center gap-1',
        showTrend && (positive ? 'text-success' : 'text-destructive')
      )}>
        {showTrend && (
          positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />
        )}
        {value}
      </div>
    </div>
  );
}
