import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTradingStore } from '@/stores';
import { formatCurrency, formatTime, formatTxHash } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

export function RecentTradesTable() {
  const trades = useTradingStore((s) => s.trades);
  const recentTrades = trades.slice(0, 10);

  return (
    <Card className="glass-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Recent Trades</CardTitle>
          <Badge variant="outline" className="font-mono text-xs">
            Last {recentTrades.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Pair</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-right">Profit</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade) => {
                const isProfit = trade.profit >= 0;
                return (
                  <tr
                    key={trade.id}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <td className="py-3 font-mono text-xs text-muted-foreground">
                      {formatTime(trade.timestamp)}
                    </td>
                    <td className="py-3 font-medium">{trade.pair}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-xs">
                        {trade.type === 'cex-to-dex' ? (
                          <>
                            <ArrowDownRight className="h-3 w-3 text-primary" />
                            <span>CEX→DEX</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="h-3 w-3 text-accent" />
                            <span>DEX→CEX</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right font-mono">
                      {formatCurrency(trade.amountIn)}
                    </td>
                    <td className={cn(
                      'py-3 text-right font-mono font-medium',
                      isProfit ? 'text-success' : 'text-destructive'
                    )}>
                      {isProfit ? '+' : ''}{formatCurrency(trade.profit)}
                    </td>
                    <td className="py-3 text-center">
                      <Badge
                        variant={trade.status === 'success' ? 'default' : 'destructive'}
                        className={cn(
                          'text-xs',
                          trade.status === 'success' && 'bg-success/10 text-success border-success/20',
                          trade.status === 'failed' && 'bg-destructive/10 text-destructive border-destructive/20',
                          trade.status === 'pending' && 'bg-warning/10 text-warning border-warning/20'
                        )}
                      >
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {recentTrades.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No trades yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
