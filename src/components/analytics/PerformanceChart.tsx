import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { useTradingStore } from '@/stores';
import { generatePnLChartData } from '@/services/mockData';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { TimeRange } from '@/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const timeRanges: TimeRange[] = ['1H', '6H', '24H', '1W', '1M', '3M', '6M', '1Y', 'ALL'];

export const PerformanceChart = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24H');
  const { trades, portfolio } = useTradingStore();

  // Generate chart data from real trades or use mock data
  const chartData = useMemo(() => {
    if (trades.length === 0) {
      return generatePnLChartData(selectedRange);
    }

    // Build cumulative P&L chart from real trades
    const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp);
    let cumulative = portfolio.totalValue - portfolio.dailyPnL; // Starting value

    return sortedTrades.map((trade) => {
      cumulative += parseFloat(trade.profit || '0');
      return {
        timestamp: trade.timestamp,
        value: cumulative,
      };
    });
  }, [trades, selectedRange, portfolio]);

  const formatXAxis = (timestamp: number) => {
    if (selectedRange === '1H' || selectedRange === '6H') {
      return format(new Date(timestamp), 'HH:mm');
    }
    if (selectedRange === '24H') {
      return format(new Date(timestamp), 'HH:mm');
    }
    if (selectedRange === '1W') {
      return format(new Date(timestamp), 'EEE');
    }
    return format(new Date(timestamp), 'MMM d');
  };

  // Calculate stats
  const startValue = chartData.length > 0 ? chartData[0].value : 0;
  const endValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
  const change = endValue - startValue;
  const changePercent = startValue > 0 ? (change / startValue) * 100 : 0;
  const isPositive = change >= 0;

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting chart data...');
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Portfolio Performance
              </CardTitle>
              <Badge 
                variant="outline" 
                className={cn(
                  "font-mono",
                  isPositive 
                    ? "bg-success/10 text-success border-success/30" 
                    : "bg-destructive/10 text-destructive border-destructive/30"
                )}
              >
                {isPositive ? '+' : ''}{formatPercent(changePercent)}
              </Badge>
            </div>
            
            {/* Period Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Change: </span>
                <span className={cn(
                  "font-mono font-semibold",
                  isPositive ? "text-success" : "text-destructive"
                )}>
                  {isPositive ? '+' : ''}{formatCurrency(change)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Period: </span>
                <span className="font-medium">{selectedRange}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-1 pt-2">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedRange(range)}
              className={cn(
                "h-8 px-3 text-xs transition-all",
                selectedRange === range
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRange}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPositive ? "hsl(var(--color-success))" : "hsl(var(--color-destructive))"} 
                      stopOpacity={0.4} 
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPositive ? "hsl(var(--color-success))" : "hsl(var(--color-destructive))"} 
                      stopOpacity={0} 
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.2} 
                  vertical={false}
                />

                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />

                <YAxis
                  tickFormatter={(value) => 
                    value >= 1000 
                      ? `$${(value / 1000).toFixed(1)}k` 
                      : `$${value.toFixed(0)}`
                  }
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 200', 'dataMax + 200']}
                  width={60}
                  dx={-10}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                  labelFormatter={(timestamp) => format(new Date(timestamp), 'PPpp')}
                />

                {/* Reference line at starting value */}
                <ReferenceLine
                  y={startValue}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                  label={{ 
                    value: 'Start', 
                    position: 'insideTopLeft',
                    fill: 'hsl(var(--muted-foreground))',
                    fontSize: 11,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "hsl(var(--color-success))" : "hsl(var(--color-destructive))"}
                  strokeWidth={2.5}
                  fill="url(#performanceGradient)"
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>

        {/* No Data Message */}
        {chartData.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No performance data for this period</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};