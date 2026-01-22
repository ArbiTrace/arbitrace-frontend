import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TradeFilterControls, TradeDetailModal, TradeHistoryTable } from '@/components/history';
import { History as HistoryIcon, Download } from 'lucide-react';
import { Trade } from '@/types';
import { useTradingStore } from '@/stores';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const History = () => {
  const { trades } = useTradingStore();
  const { isConnected } = useWebSocket();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Generate CSV with all trade data
      const headers = [
        'Date', 'Time', 'Pair', 'Direction', 'Amount In', 'Token In',
        'Amount Out', 'Token Out', 'Profit', 'Profit %', 'Gas Cost',
        'Execution Time', 'Slippage', 'AI Confidence', 'Status', 'TX Hash'
      ];

      const rows = trades.map((trade) => [
        new Date(trade.timestamp).toLocaleDateString(),
        new Date(trade.timestamp).toLocaleTimeString(),
        trade.pair,
        trade.type === 'cex-to-dex' ? 'CEX→DEX' : 'DEX→CEX',
        trade.amountIn,
        trade.amountInToken,
        trade.amountOut,
        trade.amountOutToken,
        trade.profit,
        trade.profitPercent.toFixed(2),
        trade.gasCost,
        trade.executionTime,
        trade.slippage,
        trade.aiConfidence || 0,
        trade.status,
        trade.txHash,
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arbitrace-trades-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('✅ Trades exported successfully!', {
        icon: '📥',
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to export trades');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const profitableTrades = trades.filter(t => parseFloat(t.profit || '0') > 0).length;
  const totalProfit = trades.reduce((sum, t) => sum + parseFloat(t.profit || '0'), 0);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <HistoryIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Trade History
              </h1>
              <p className="text-muted-foreground mt-1">
                Complete record of all executed trades
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Status */}
            {!isConnected && (
              <Badge variant="outline" className="gap-1.5 bg-warning/10 text-warning border-warning/20">
                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                Agent Offline
              </Badge>
            )}

            {/* Stats Badges */}
            <Badge variant="outline" className="font-mono">
              {trades.length} total trades
            </Badge>

            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={trades.length === 0 || isExporting}
              className="gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        {trades.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="glass-card p-4 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
              <p className="text-2xl font-mono font-bold text-success">
                {((profitableTrades / trades.length) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {profitableTrades} / {trades.length} profitable
              </p>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Total Profit</p>
              <p className={`text-2xl font-mono font-bold ${totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Across all trades
              </p>
            </div>

            <div className="glass-card p-4 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Avg Profit/Trade</p>
              <p className={`text-2xl font-mono font-bold ${totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${(totalProfit / trades.length).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Per executed trade
              </p>
            </div>
          </motion.div>
        )}

        {/* No Trades Warning */}
        {trades.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3"
          >
            <HistoryIcon className="h-5 w-5 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-warning">No trade history yet</p>
              <p className="text-xs text-warning/80 mt-1">
                Trades will appear here once the agent executes them. Make sure the agent is active on the Dashboard.
              </p>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <TradeFilterControls onExport={handleExport} />

        {/* Table */}
        <TradeHistoryTable onSelectTrade={setSelectedTrade} />

        {/* Detail Modal */}
        <TradeDetailModal 
          trade={selectedTrade} 
          onClose={() => setSelectedTrade(null)} 
        />
      </div>
    </Layout>
  );
};

export default History;