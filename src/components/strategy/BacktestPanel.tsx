import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, TrendingUp, TrendingDown, Activity, Target, Brain, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useStrategyStore, useTradingStore } from '@/stores';
import { generateBacktestResult } from '@/services/mockData';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

export const BacktestPanel = () => {
  const { activeStrategy, backtestResult, setBacktestResult } = useStrategyStore();
  const { agentStatus } = useTradingStore();
  const [initialCapital, setInitialCapital] = useState(10000);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunBacktest = async () => {
    if (!activeStrategy) {
      return;
    }

    setIsRunning(true);
    
    // Simulate backtest running
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const result = generateBacktestResult(initialCapital);
    setBacktestResult(result);
    setIsRunning(false);
  };

  const isProfit = backtestResult && backtestResult.totalReturnPercent >= 0;

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Backtest Simulator
          </CardTitle>
          {backtestResult && (
            <Badge 
              variant="outline" 
              className={cn(
                "font-mono",
                isProfit 
                  ? "bg-success/10 text-success border-success/30" 
                  : "bg-destructive/10 text-destructive border-destructive/30"
              )}
            >
              {isProfit ? '+' : ''}{formatPercent(backtestResult.totalReturnPercent)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Test your strategy against historical market data
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Initial Capital (USD)</Label>
            <Input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)}
              className="font-mono bg-secondary/50 border-border/50 focus:border-primary"
              disabled={isRunning}
              min={100}
              max={100000}
              step={100}
            />
            <p className="text-xs text-muted-foreground">
              Starting capital for simulation
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Active Strategy</Label>
            <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
              <p className="font-mono text-sm">
                {activeStrategy?.name || 'No strategy selected'}
              </p>
              {activeStrategy && (
                <p className="text-xs text-muted-foreground mt-1">
                  {activeStrategy.riskLevel} risk • {(activeStrategy.minProfitThreshold * 100).toFixed(1)}% min profit
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Run Button */}
        <Button
          onClick={handleRunBacktest}
          disabled={isRunning || !activeStrategy || initialCapital < 100}
          className={cn(
            "w-full gap-2",
            !isRunning && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric"
          )}
        >
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
              <span>Simulating trades...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run AI Backtest
            </>
          )}
        </Button>

        {/* Results */}
        <AnimatePresence mode="wait">
          {backtestResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-secondary/30 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {isProfit ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 w-4 text-destructive" />
                    )}
                    <span className="text-xs text-muted-foreground">Return</span>
                  </div>
                  <p className={cn(
                    "font-mono font-bold text-lg",
                    isProfit ? 'text-success' : 'text-destructive'
                  )}>
                    {formatPercent(backtestResult.totalReturnPercent)}
                  </p>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Win Rate</span>
                  </div>
                  <p className="font-mono font-bold text-lg text-foreground">
                    {formatPercent(backtestResult.winRate)}
                  </p>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Sharpe</span>
                  </div>
                  <p className="font-mono font-bold text-lg text-foreground">
                    {backtestResult.sharpeRatio.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <span className="text-xs text-muted-foreground">Drawdown</span>
                  </div>
                  <p className="font-mono font-bold text-lg text-destructive">
                    {formatPercent(backtestResult.maxDrawdown)}
                  </p>
                </div>
              </div>

              {/* Final Capital */}
              <div className="bg-secondary/20 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Final Capital</p>
                  <p className="font-mono text-2xl font-bold text-foreground">
                    {formatCurrency(backtestResult.finalCapital)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">Profit/Loss</p>
                  <p className={cn(
                    "font-mono text-xl font-bold",
                    isProfit ? "text-success" : "text-destructive"
                  )}>
                    {isProfit ? '+' : ''}{formatCurrency(backtestResult.finalCapital - initialCapital)}
                  </p>
                </div>
              </div>

              {/* Equity Curve */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Portfolio Growth Curve</p>
                <div className="h-48 rounded-lg bg-secondary/20 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={backtestResult.equityCurve}>
                      <defs>
                        <linearGradient id="backtestGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop 
                            offset="5%" 
                            stopColor={isProfit ? "hsl(var(--color-success))" : "hsl(var(--color-destructive))"} 
                            stopOpacity={0.4} 
                          />
                          <stop 
                            offset="95%" 
                            stopColor={isProfit ? "hsl(var(--color-success))" : "hsl(var(--color-destructive))"} 
                            stopOpacity={0} 
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="hsl(var(--color-border))" 
                        strokeOpacity={0.2}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="timestamp" 
                        hide 
                      />
                      <YAxis 
                        hide 
                        domain={['dataMin - 500', 'dataMax + 500']} 
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                        labelFormatter={() => ''}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={isProfit ? "hsl(var(--color-success))" : "hsl(var(--color-destructive))"}
                        strokeWidth={2}
                        fill="url(#backtestGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-secondary/20 rounded p-2">
                  <p className="text-muted-foreground mb-1">Total Trades</p>
                  <p className="font-mono font-semibold">{backtestResult.totalTrades}</p>
                </div>
                <div className="bg-secondary/20 rounded p-2">
                  <p className="text-muted-foreground mb-1">Avg Trade</p>
                  <p className="font-mono font-semibold">
                    {formatCurrency((backtestResult.finalCapital - initialCapital) / backtestResult.totalTrades)}
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                <p className="text-xs text-warning flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>
                    Backtest results are simulated and do not guarantee future performance.
                    Past results are not indicative of future returns.
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!backtestResult && !isRunning && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mb-1">
              No backtest results yet
            </p>
            <p className="text-xs text-muted-foreground/70">
              Run a simulation to see how your strategy performs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};