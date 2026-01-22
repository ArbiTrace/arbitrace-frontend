import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useTradingStore } from '@/stores';
import { generateTradeDistributionData } from '@/services/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';

export const TradeDistribution = () => {
  const { trades } = useTradingStore();

  const data = useMemo(() => {
    if (trades.length === 0) {
      return generateTradeDistributionData();
    }

    // Calculate distribution from real trades
    const ranges = [
      { min: -Infinity, max: -10, label: '< -10%', type: 'loss' },
      { min: -10, max: -5, label: '-10% to -5%', type: 'loss' },
      { min: -5, max: -2, label: '-5% to -2%', type: 'loss' },
      { min: -2, max: 0, label: '-2% to 0%', type: 'loss' },
      { min: 0, max: 2, label: '0% to 2%', type: 'profit' },
      { min: 2, max: 5, label: '2% to 5%', type: 'profit' },
      { min: 5, max: 10, label: '5% to 10%', type: 'profit' },
      { min: 10, max: Infinity, label: '> 10%', type: 'profit' },
    ];

    const distribution = ranges.map(range => {
      const count = trades.filter(trade => {
        const profitPercent = trade.profitPercent || 0;
        return profitPercent >= range.min && profitPercent < range.max;
      }).length;

      return {
        range: range.label,
        count,
        type: range.type,
      };
    });

    return distribution;
  }, [trades]);

  const totalTrades = data.reduce((sum, item) => sum + item.count, 0);
  const profitTrades = data.filter(d => d.type === 'profit').reduce((sum, item) => sum + item.count, 0);
  const lossTrades = data.filter(d => d.type === 'loss').reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="space-y-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Trade Distribution
          </CardTitle>

          {/* Summary Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-success/80" />
              <span className="text-muted-foreground">Profitable:</span>
              <span className="font-mono font-semibold text-success">{profitTrades}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-destructive/80" />
              <span className="text-muted-foreground">Loss:</span>
              <span className="font-mono font-semibold text-destructive">{lossTrades}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.2}
                horizontal={false}
              />
              
              <XAxis 
                type="number" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              
              <YAxis 
                type="category" 
                dataKey="range" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => {
                  const percentage = totalTrades > 0 ? ((value / totalTrades) * 100).toFixed(1) : 0;
                  return [`${value} trades (${percentage}%)`, 'Count'];
                }}
              />
              
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.type === 'profit' ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                    opacity={0.8}
                    className="transition-opacity hover:opacity-100"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          Distribution of {totalTrades} trade returns by percentage range
        </p>

        {trades.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No trade data yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Execute trades to see distribution
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};