import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TradeFilterControls } from '@/components/history/TradeFilterControls';
import { TradeHistoryTable } from '@/components/history/TradeHistoryTable';
import { TradeDetailModal } from '@/components/history/TradeDetailModal';
import { History as HistoryIcon } from 'lucide-react';
import { Trade } from '@/types';
import { useTradingStore } from '@/stores';
import { toast } from 'sonner';

const History = () => {
  const { trades } = useTradingStore();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const handleExport = () => {
    // Generate CSV
    const headers = ['Date', 'Pair', 'Type', 'Amount In', 'Amount Out', 'Profit', 'Gas Cost', 'Status', 'TX Hash'];
    const rows = trades.map((trade) => [
      new Date(trade.timestamp).toISOString(),
      trade.pair,
      trade.type,
      trade.amountIn.toFixed(2),
      trade.amountOut.toFixed(2),
      trade.profit.toFixed(2),
      trade.gasCost.toFixed(4),
      trade.status,
      trade.txHash,
    ]);
    
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arbitrace-trades-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Trades exported successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <HistoryIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Trade History
            </h1>
            <p className="text-muted-foreground">
              Complete record of all executed trades
            </p>
          </div>
        </div>

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
