import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Search,
  Copy,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useTradingStore } from '@/stores';
import {
  formatCurrency,
  formatTime,
  formatTxHash,
  formatDuration,
} from '@/utils/formatters';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

type SortField = 'timestamp' | 'pair' | 'profit' | 'amount';
type SortDirection = 'asc' | 'desc';
type FilterStatus = 'all' | 'success' | 'pending' | 'failed';

interface Trade {
  id: string;
  timestamp: number;
  pair: string;
  type: 'cex-to-dex' | 'dex-to-cex';
  amountIn: number;
  amountInToken: string;
  amountOut: number;
  amountOutToken: string;
  profit: number;
  profitPercent: number;
  gasUsed: number;
  gasCost: number;
  executionTime: number;
  slippage: number;
  status: 'pending' | 'success' | 'failed';
  txHash: string;
  aiConfidence?: number;
  aiReasoning?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function sortTrades(
  trades: Trade[],
  field: SortField,
  direction: SortDirection
): Trade[] {
  return [...trades].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'timestamp':
        comparison = a.timestamp - b.timestamp;
        break;
      case 'pair':
        comparison = a.pair.localeCompare(b.pair);
        break;
      case 'profit':
        comparison = a.profit - b.profit;
        break;
      case 'amount':
        comparison = a.amountIn - b.amountIn;
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

function filterTrades(trades: Trade[], status: FilterStatus): Trade[] {
  if (status === 'all') return trades;
  return trades.filter((trade) => trade.status === status);
}

// ============================================================================
// Sub-Components
// ============================================================================

function StatusBadge({ status }: { status: Trade['status'] }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-medium',
        status === 'success' &&
          'bg-success/10 text-success border-success/20',
        status === 'failed' &&
          'bg-destructive/10 text-destructive border-destructive/20',
        status === 'pending' &&
          'bg-warning/10 text-warning border-warning/20 animate-pulse'
      )}
    >
      {status === 'success' && '✓ Success'}
      {status === 'failed' && '✗ Failed'}
      {status === 'pending' && '⟳ Pending'}
    </Badge>
  );
}

function TradeTypeIndicator({ type }: { type: Trade['type'] }) {
  const isCexToDex = type === 'cex-to-dex';

  return (
    <div className="flex items-center gap-1 text-xs">
      {isCexToDex ? (
        <>
          <ArrowDownRight className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">CEX→DEX</span>
        </>
      ) : (
        <>
          <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
          <span className="font-medium">DEX→CEX</span>
        </>
      )}
    </div>
  );
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      title={`Copy ${label || 'to clipboard'}`}
    >
      {copied ? (
        <Check className="h-3 w-3 text-success" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}

function TradeDetailsRow({ trade }: { trade: Trade }) {
  return (
    <motion.tr
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <td colSpan={6} className="p-4 bg-secondary/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Execution Time</p>
            <p className="font-mono">{formatDuration(trade.executionTime)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Gas Cost</p>
            <p className="font-mono">{formatCurrency(trade.gasCost)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Slippage</p>
            <p className="font-mono">{(trade.slippage * 100).toFixed(2)}%</p>
          </div>
          {trade.aiConfidence && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                AI Confidence
              </p>
              <p className="font-mono">{trade.aiConfidence}%</p>
            </div>
          )}
          <div className="col-span-2 md:col-span-4">
            <p className="text-xs text-muted-foreground mb-1">
              Transaction Hash
            </p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-background px-2 py-1 rounded font-mono">
                {formatTxHash(trade.txHash)}
              </code>
              <CopyButton text={trade.txHash} label="transaction hash" />
              <a
                href={`https://explorer.cronos.org/testnet/tx/${trade.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          {trade.aiReasoning && (
            <div className="col-span-2 md:col-span-4">
              <p className="text-xs text-muted-foreground mb-1">AI Reasoning</p>
              <p className="text-xs text-foreground/80 italic">
                "{trade.aiReasoning}"
              </p>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function RecentTradesTable() {
  const trades = useTradingStore((s) => s.trades);
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  console.log('trades', trades)
  const filteredAndSortedTrades = useMemo(() => {
    let result = filterTrades(trades, filterStatus);

    if (searchQuery) {
      result = result.filter((trade) =>
        trade.pair.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return sortTrades(result, sortField, sortDirection);
  }, [trades, sortField, sortDirection, filterStatus, searchQuery]);

  const displayTrades = filteredAndSortedTrades.slice(0, 20);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log('Exporting trades to CSV...');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3.5 w-3.5" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5" />
    );
  };

  return (
    <Card className="glass-hover">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Title */}
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-display">Recent Trades</CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              {filteredAndSortedTrades.length} Total
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search pairs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 w-32 sm:w-40"
              />
            </div>

            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Filter className="h-3.5 w-3.5" />
                  {filterStatus === 'all' ? 'All' : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['all', 'success', 'pending', 'failed'] as FilterStatus[]).map(
                  (status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={cn(
                        filterStatus === status && 'bg-secondary'
                      )}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-8 gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th
                  className="pb-3 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center gap-1">
                    Time
                    <SortIcon field="timestamp" />
                  </div>
                </th>
                <th
                  className="pb-3 font-medium cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('pair')}
                >
                  <div className="flex items-center gap-1">
                    Pair
                    <SortIcon field="pair" />
                  </div>
                </th>
                <th className="pb-3 font-medium">Type</th>
                <th
                  className="pb-3 font-medium text-right cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    <SortIcon field="amount" />
                  </div>
                </th>
                <th
                  className="pb-3 font-medium text-right cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort('profit')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Profit
                    <SortIcon field="profit" />
                  </div>
                </th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {displayTrades.map((trade) => {
                  const isProfit = trade.profit >= 0;
                  const isExpanded = expandedTradeId === trade.id;

                  return (
                    <>
                      <motion.tr
                        key={trade.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          'border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer',
                          isExpanded && 'bg-secondary/20'
                        )}
                        onClick={() =>
                          setExpandedTradeId(
                            isExpanded ? null : trade.id
                          )
                        }
                      >
                        <td className="py-3 font-mono text-xs text-muted-foreground">
                          {formatTime(trade.timestamp)}
                        </td>
                        <td className="py-3 font-medium">{trade.pair}</td>
                        <td className="py-3">
                          <TradeTypeIndicator type={trade.type} />
                        </td>
                        <td className="py-3 text-right font-mono">
                          {formatCurrency(trade.amountIn)}
                        </td>
                        <td
                          className={cn(
                            'py-3 text-right font-mono font-medium',
                            isProfit ? 'text-success' : 'text-destructive'
                          )}
                        >
                          {isProfit ? '+' : ''}
                          {formatCurrency(trade.profit)}
                        </td>
                        <td className="py-3 text-center">
                          <StatusBadge status={trade.status} />
                        </td>
                      </motion.tr>
                      {isExpanded && <TradeDetailsRow trade={trade} />}
                    </>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {displayTrades.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-1">No trades found</p>
            <p className="text-xs">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Trades will appear here once you start trading'}
            </p>
          </div>
        )}

        {displayTrades.length > 0 && filteredAndSortedTrades.length > 20 && (
          <div className="text-center pt-4 text-sm text-muted-foreground">
            Showing {displayTrades.length} of{' '}
            {filteredAndSortedTrades.length} trades
          </div>
        )}
      </CardContent>
    </Card>
  );
}