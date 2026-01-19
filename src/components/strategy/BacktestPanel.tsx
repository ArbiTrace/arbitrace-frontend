import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStrategyStore } from '@/stores';
import { generateBacktestResult } from '@/services/mockData';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const BacktestPanel = () => {
  const { activeStrategy, backtestResult, setBacktestResult } = useStrategyStore();
  const [initialCapital, setInitialCapital] = useState(10000);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunBacktest = async () => {
    setIsRunning(true);
    // Simulate backtest running
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = generateBacktestResult(initialCapital);
    setBacktestResult(result);
    setIsRunning(false);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Backtest Simulator
        </CardTitle>
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
              className="font-mono bg-secondary/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Strategy</Label>
            <Input
              value={activeStrategy?.name || 'Select a strategy'}
              disabled
              className="font-mono bg-secondary/50 border-border/50"
            />
          </div>
        </div>

        <Button
          onClick={handleRunBacktest}
          disabled={isRunning || !activeStrategy}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric"
        >
          {isRunning ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Backtest
            </>
          )}
        </Button>

        {/* Results */}
        {backtestResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {backtestResult.totalReturnPercent >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className="text-xs text-muted-foreground">Total Return</span>
                </div>
                <p className={`font-mono font-bold ${backtestResult.totalReturnPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatPercent(backtestResult.totalReturnPercent)}
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Win Rate</span>
                </div>
                <p className="font-mono font-bold text-foreground">
                  {formatPercent(backtestResult.winRate)}
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <span className="text-xs text-muted-foreground">Sharpe Ratio</span>
                <p className="font-mono font-bold text-foreground">
                  {backtestResult.sharpeRatio.toFixed(2)}
                </p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <span className="text-xs text-muted-foreground">Max Drawdown</span>
                <p className="font-mono font-bold text-destructive">
                  {formatPercent(backtestResult.maxDrawdown)}
                </p>
              </div>
            </div>

            {/* Final Capital */}
            <div className="bg-secondary/20 rounded-lg p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Final Capital</span>
              <span className="font-mono text-xl font-bold text-foreground">
                {formatCurrency(backtestResult.finalCapital)}
              </span>
            </div>

            {/* Equity Curve */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={backtestResult.equityCurve}>
                  <defs>
                    <linearGradient id="backtestGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    formatter={(value: number) => [formatCurrency(value), 'Portfolio']}
                    labelFormatter={() => ''}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#backtestGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Based on {backtestResult.totalTrades} simulated trades over the selected period
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
