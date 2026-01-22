import { useMemo, useState, useRef, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Maximize2,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { generatePnLChartData } from '@/services/mockData';
import {
  formatCurrency,
  formatShortTime,
  formatPercent,
} from '@/utils/formatters';
import { cn } from '@/lib/utils';

// ============================================================================
// Constants & Types
// ============================================================================

type TimeRange = '1H' | '6H' | '24H' | '1W' | '1M' | 'ALL';

interface ChartDataPoint {
  timestamp: number;
  value: number;
  time: string;
}

interface ChartStats {
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  average: number;
}

const TIME_RANGES: TimeRange[] = ['1H', '6H', '24H', '1W', '1M', 'ALL'];

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  '1H': '1 Hour',
  '6H': '6 Hours',
  '24H': '24 Hours',
  '1W': '1 Week',
  '1M': '1 Month',
  ALL: 'All Time',
};

// ============================================================================
// Helper Functions
// ============================================================================

function calculateChartStats(data: ChartDataPoint[]): ChartStats {
  if (data.length === 0) {
    return {
      current: 0,
      change: 0,
      changePercent: 0,
      high: 0,
      low: 0,
      average: 0,
    };
  }

  const values = data.map((d) => d.value);
  const startValue = data[0].value;
  const endValue = data[data.length - 1].value;
  const change = endValue - startValue;
  const changePercent = startValue !== 0 ? (change / startValue) * 100 : 0;

  return {
    current: endValue,
    change,
    changePercent,
    high: Math.max(...values),
    low: Math.min(...values),
    average: values.reduce((a, b) => a + b, 0) / values.length,
  };
}

function exportChartAsImage(chartRef: HTMLDivElement | null) {
  if (!chartRef) return;

  // This would integrate with html2canvas or similar library
  console.log('Exporting chart...', chartRef);
  // TODO: Implement actual export functionality
}

// ============================================================================
// Sub-Components
// ============================================================================

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const value = payload[0].value as number;
  const isPositive = value >= data.baseValue || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-popover/95 backdrop-blur-xl border border-border rounded-lg p-3 shadow-xl"
    >
      <p className="text-xs text-muted-foreground mb-1">{data.time}</p>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'font-mono font-bold text-sm',
            isPositive ? 'text-success' : 'text-destructive'
          )}
        >
          {formatCurrency(value)}
        </span>
        {data.changeFromPrevious && (
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              data.changeFromPrevious >= 0
                ? 'border-success/30 text-success'
                : 'border-destructive/30 text-destructive'
            )}
          >
            {data.changeFromPrevious >= 0 ? '+' : ''}
            {formatPercent(data.changeFromPrevious / 100)}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}

function StatBadge({
  label,
  value,
  icon: Icon,
  variant = 'default',
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
  variant?: 'default' | 'success' | 'destructive';
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/50">
      {Icon && (
        <Icon
          className={cn(
            'h-3.5 w-3.5',
            variant === 'success' && 'text-success',
            variant === 'destructive' && 'text-destructive'
          )}
        />
      )}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className={cn(
            'font-mono text-xs font-semibold',
            variant === 'success' && 'text-success',
            variant === 'destructive' && 'text-destructive'
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ProfitLossChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24H');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    return generatePnLChartData(selectedRange).map((point, index, arr) => {
      const changeFromPrevious =
        index > 0
          ? ((point.value - arr[index - 1].value) / arr[index - 1].value) * 100
          : 0;

      return {
        ...point,
        time: formatShortTime(point.timestamp),
        changeFromPrevious,
        baseValue: arr[0]?.value || 0,
      };
    });
  }, [selectedRange]);

  const stats = useMemo(() => calculateChartStats(chartData), [chartData]);
  const isPositive = stats.change >= 0;

  // Auto-select best time range on mount
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      setSelectedRange('6H');
    } else if (hour >= 6 && hour < 12) {
      setSelectedRange('24H');
    }
  }, []);

  return (
    <Card className="glass-hover h-full flex flex-col" ref={chartRef}>
      <CardHeader className="pb-2 space-y-3">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-display">
                P&L Performance
              </CardTitle>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Cumulative profit and loss over the selected time period.
                      Includes all trading fees and gas costs.
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>

            {/* Current Value & Change */}
            <motion.div
              key={stats.change}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <div
                className={cn(
                  'flex items-center gap-1 text-sm font-mono font-semibold',
                  isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {isPositive ? '+' : ''}
                  {formatCurrency(stats.change)}
                </span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  isPositive
                    ? 'border-success/30 text-success'
                    : 'border-destructive/30 text-destructive'
                )}
              >
                {isPositive ? '+' : ''}
                {formatPercent(stats.changePercent)}
              </Badge>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportChartAsImage(chartRef.current)}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {TIME_RANGES.map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'h-7 px-3 text-xs font-medium transition-all',
                selectedRange === range && 'shadow-sm'
              )}
              onClick={() => setSelectedRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <StatBadge
            label="High"
            value={formatCurrency(stats.high)}
            variant="success"
          />
          <StatBadge
            label="Low"
            value={formatCurrency(stats.low)}
            variant="destructive"
          />
          <StatBadge
            label="Avg"
            value={formatCurrency(stats.average)}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-2 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRange}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-60 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={
                        isPositive
                          ? 'hsl(var(--color-success))'
                          : 'hsl(var(--color-destructive))'
                      }
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        isPositive
                          ? 'hsl(var(--color-success))'
                          : 'hsl(var(--color-destructive))'
                      }
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
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'hsl(var(--color-muted-foreground))',
                    fontSize: 11,
                  }}
                  interval="preserveStartEnd"
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'hsl(var(--color-muted-foreground))',
                    fontSize: 11,
                  }}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `$${(value / 1000).toFixed(1)}k`
                      : `$${value}`
                  }
                  domain={['dataMin - 100', 'dataMax + 100']}
                  width={55}
                  dx={-10}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Zero line reference */}
                <ReferenceLine
                  y={chartData[0]?.baseValue || 0}
                  stroke="hsl(var(--color-muted-foreground))"
                  strokeDasharray="3 3"
                  strokeOpacity={0.5}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={
                    isPositive
                      ? 'hsl(var(--color-success))'
                      : 'hsl(var(--color-destructive))'
                  }
                  strokeWidth={2.5}
                  fill="url(#pnlGradient)"
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}