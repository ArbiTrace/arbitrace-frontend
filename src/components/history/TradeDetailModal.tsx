import { motion, AnimatePresence } from 'framer-motion';
import { Trade } from '@/types';
import { formatCurrency, formatPercent, formatDateTime, formatDuration } from '@/utils/formatters';
import { X, ExternalLink, ArrowUpRight, ArrowDownRight, Cpu, Clock, Fuel, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TradeDetailModalProps {
  trade: Trade | null;
  onClose: () => void;
}

export const TradeDetailModal = ({ trade, onClose }: TradeDetailModalProps) => {
  if (!trade) return null;

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-display font-bold">{trade.pair}</h2>
                {getStatusBadge(trade.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(trade.timestamp)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Direction & Profit */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {trade.type === 'cex-to-dex' ? (
                  <ArrowDownRight className="w-5 h-5 text-primary" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-ai-purple" />
                )}
                <span className="text-sm text-muted-foreground">Direction</span>
              </div>
              <p className="font-semibold">
                {trade.type === 'cex-to-dex' ? 'CEX → DEX' : 'DEX → CEX'}
              </p>
            </div>
            <div className="bg-secondary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-success" />
                <span className="text-sm text-muted-foreground">Net Profit</span>
              </div>
              <p className={cn(
                'font-mono font-bold text-lg',
                trade.profit >= 0 ? 'text-success' : 'text-destructive'
              )}>
                {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit)}
                <span className="text-sm ml-1">({formatPercent(trade.profitPercent)})</span>
              </p>
            </div>
          </div>

          {/* Trade Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground">Amount In</span>
              <span className="font-mono">{formatCurrency(trade.amountIn)} {trade.amountInToken}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground">Amount Out</span>
              <span className="font-mono">{formatCurrency(trade.amountOut)} {trade.amountOutToken}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-muted-foreground">Slippage</span>
              <span className="font-mono">{formatPercent(trade.slippage)}</span>
            </div>
          </div>

          {/* Execution Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-secondary/20 rounded-lg p-3 text-center">
              <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Execution</p>
              <p className="font-mono text-sm">{formatDuration(trade.executionTime / 1000)}</p>
            </div>
            <div className="bg-secondary/20 rounded-lg p-3 text-center">
              <Fuel className="w-4 h-4 mx-auto mb-1 text-warning" />
              <p className="text-xs text-muted-foreground">Gas Cost</p>
              <p className="font-mono text-sm">{formatCurrency(trade.gasCost)}</p>
            </div>
            <div className="bg-secondary/20 rounded-lg p-3 text-center">
              <Cpu className="w-4 h-4 mx-auto mb-1 text-ai-purple" />
              <p className="text-xs text-muted-foreground">AI Confidence</p>
              <p className="font-mono text-sm">{trade.aiConfidence}%</p>
            </div>
          </div>

          {/* AI Reasoning */}
          {trade.aiReasoning && (
            <div className="bg-ai-purple/10 border border-ai-purple/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-ai-purple" />
                <span className="text-sm font-semibold text-ai-purple">AI Reasoning</span>
              </div>
              <p className="text-sm text-muted-foreground">{trade.aiReasoning}</p>
            </div>
          )}

          {/* Transaction Link */}
          <Button
            variant="outline"
            className="w-full border-border/50 hover:border-primary/50"
            onClick={() => window.open(`https://cronoscan.com/tx/${trade.txHash}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Cronoscan
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
