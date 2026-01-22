import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore, useUIStore } from '@/stores';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatPercent, formatDateTime, formatTxHash } from '@/utils/formatters';
import { Trade } from '@/types';
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 15;

interface TradeHistoryTableProps {
  onSelectTrade: (trade: Trade) => void;
}

export const TradeHistoryTable = ({ onSelectTrade }: TradeHistoryTableProps) => {
  const { trades } = useTradingStore();
  const { tradeFilters } = useUIStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Trade>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter trades
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      if (tradeFilters.pair && trade.pair !== tradeFilters.pair) return false;
      if (tradeFilters.status && trade.status !== tradeFilters.status) return false;
      if (tradeFilters.dateFrom && trade.timestamp < tradeFilters.dateFrom) return false;
      if (tradeFilters.dateTo && trade.timestamp > tradeFilters.dateTo) return false;
      if (tradeFilters.search && !trade.txHash.toLowerCase().includes(tradeFilters.search.toLowerCase())) return false;
      return true;
    });
  }, [trades, tradeFilters]);

  // Sort trades
  const sortedTrades = useMemo(() => {
    return [...filteredTrades].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredTrades, sortField, sortDirection]);

  // Paginate
  const totalPages = Math.ceil(sortedTrades.length / ITEMS_PER_PAGE);
  const paginatedTrades = sortedTrades.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: Trade['status']) => {
    const variants = {
      success: 'bg-success/20 text-success border-success/30',
      failed: 'bg-destructive/20 text-destructive border-destructive/30',
      pending: 'bg-warning/20 text-warning border-warning/30',
    };
    return (
      <Badge className={cn('border font-mono', variants[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('timestamp')}
              >
                Date/Time {sortField === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Pair</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('amountIn')}
              >
                Amount In
              </TableHead>
              <TableHead className="text-right">Amount Out</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('profit')}
              >
                Profit {sortField === 'profit' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right">Gas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">TX</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {paginatedTrades.map((trade, index) => (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => onSelectTrade(trade)}
                  className="border-border/30 hover:bg-secondary/30 cursor-pointer transition-colors"
                >
                  <TableCell className="font-mono text-sm">
                    {formatDateTime(trade.timestamp)}
                  </TableCell>
                  <TableCell className="font-semibold">{trade.pair}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {trade.type === 'cex-to-dex' ? (
                        <ArrowDownRight className="w-4 h-4 text-primary" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-ai-purple" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {trade.type === 'cex-to-dex' ? 'CEX→DEX' : 'DEX→CEX'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(trade.amountIn)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(trade.amountOut)}
                  </TableCell>
                  <TableCell className={cn(
                    'text-right font-mono font-semibold',
                    trade.profit >= 0 ? 'text-success' : 'text-destructive'
                  )}>
                    {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({formatPercent(trade.profitPercent)})
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatCurrency(trade.gasCost)}
                  </TableCell>
                  <TableCell>{getStatusBadge(trade.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://cronoscan.com/tx/${trade.txHash}`, '_blank');
                      }}
                    >
                      <span className="font-mono text-xs">{formatTxHash(trade.txHash)}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, sortedTrades.length)} of {sortedTrades.length} trades
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border-border/50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page: number;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            return (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-primary text-primary-foreground' : 'border-border/50'}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border-border/50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
