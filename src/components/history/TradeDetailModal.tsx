import { motion, AnimatePresence } from 'framer-motion';
import { Trade } from '@/types';
import { formatCurrency, formatPercent, formatDateTime, formatDuration } from '@/utils/formatters';
import { X, ExternalLink, ArrowUpRight, ArrowDownRight, Brain, Clock, Fuel, TrendingUp, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface TradeDetailModalProps {
  trade: Trade | null;
  onClose: () => void;
}

export const TradeDetailModal = ({ trade, onClose }: TradeDetailModalProps) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!trade) return null;

  const getStatusBadge = (status: Trade['status']) => {
    const variants = {
      success: 'bg-success/20 text-success border-success/30',
      failed: 'bg-destructive/20 text-destructive border-destructive/30',
      pending: 'bg-warning/20 text-warning border-warning/30',
    };
    return (
      <Badge className={cn('border font-mono', variants[status])}>
        {status === 'success' ? '✓ Success' : 
         status === 'failed' ? '✗ Failed' : 
         '⏳ Pending'}
      </Badge>
    );
  };

  const handleCopyHash = async () => {
    await navigator.clipboard.writeText(trade.txHash);
    setCopiedHash(true);
    toast.success('Transaction hash copied!', { icon: '📋' });
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const explorerUrl = `https://explorer.cronos.org/testnet/tx/${trade.txHash}`;

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
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="glass-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-border/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-display font-bold">{trade.pair}</h2>
                {getStatusBadge(trade.status)}
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {formatDateTime(trade.timestamp)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Direction & Profit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                {trade.type === 'cex-to-dex' ? (
                  <ArrowDownRight className="w-5 h-5 text-primary" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-accent" />
                )}
                <span className="text-sm font-medium text-muted-foreground">Trade Direction</span>
              </div>
              <p className="text-lg font-semibold">
                {trade.type === 'cex-to-dex' ? 'CEX → DEX' : 'DEX → CEX'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {trade.type === 'cex-to-dex' 
                  ? 'Buy on CEX, Sell on DEX' 
                  : 'Buy on DEX, Sell on CEX'}
              </p>
            </div>

            <div className={cn(
              "rounded-xl p-4 border",
              parseFloat(trade.profit || '0') >= 0 
                ? "bg-success/10 border-success/30" 
                : "bg-destructive/10 border-destructive/30"
            )}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className={cn(
                  "w-5 h-5",
                  parseFloat(trade.profit || '0') >= 0 ? "text-success" : "text-destructive"
                )} />
                <span className="text-sm font-medium text-muted-foreground">Net Profit/Loss</span>
              </div>
              <p className={cn(
                'font-mono font-bold text-2xl',
                parseFloat(trade.profit || '0') >= 0 ? 'text-success' : 'text-destructive'
              )}>
                {parseFloat(trade.profit || '0') >= 0 ? '+' : ''}
                {formatCurrency(parseFloat(trade.profit || '0'))}
              </p>
              <p className="text-sm mt-1 font-mono">
                {formatPercent(trade.profitPercent || 0)} return
              </p>
            </div>
          </div>

          {/* Trade Flow */}
          <div className="mb-6 p-4 rounded-xl bg-secondary/20 border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-3">Trade Flow</p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Input</p>
                <p className="font-mono font-bold text-lg">{formatCurrency(parseFloat(trade.amountIn || '0'))}</p>
                <p className="text-sm text-muted-foreground">{trade.amountInToken}</p>
              </div>
              <div className="flex items-center justify-center px-4">
                <ArrowUpRight className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-muted-foreground mb-1">Output</p>
                <p className="font-mono font-bold text-lg">{formatCurrency(parseFloat(trade.amountOut || '0'))}</p>
                <p className="text-sm text-muted-foreground">{trade.amountOutToken}</p>
              </div>
            </div>
          </div>

          {/* Execution Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-secondary/20 rounded-lg p-3 text-center border border-border/50">
              <Clock className="w-4 h-4 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground mb-1">Execution Time</p>
              <p className="font-mono text-sm font-semibold">
                {formatDuration((trade.executionTime || 0) / 1000)}
              </p>
            </div>

            <div className="bg-secondary/20 rounded-lg p-3 text-center border border-border/50">
              <Fuel className="w-4 h-4 mx-auto mb-2 text-warning" />
              <p className="text-xs text-muted-foreground mb-1">Gas Cost</p>
              <p className="font-mono text-sm font-semibold">
                {formatCurrency(parseFloat(trade.gasCost || '0'))}
              </p>
            </div>

            <div className="bg-secondary/20 rounded-lg p-3 text-center border border-border/50">
              <Brain className="w-4 h-4 mx-auto mb-2 text-accent" />
              <p className="text-xs text-muted-foreground mb-1">AI Confidence</p>
              <p className="font-mono text-sm font-semibold">
                {trade.aiConfidence || 0}%
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2 mb-6 p-4 rounded-xl bg-secondary/20 border border-border/50">
            <p className="text-sm font-medium text-muted-foreground mb-3">Trade Details</p>
            
            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Slippage</span>
              <span className="font-mono text-sm font-medium">
                {formatPercent((trade.slippage || 0) * 100)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-border/30">
              <span className="text-sm text-muted-foreground">Gas Used</span>
              <span className="font-mono text-sm font-medium">
                {(trade.gasUsed || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-sm text-muted-foreground">Trade ID</span>
              <span className="font-mono text-xs text-muted-foreground">
                {trade.id}
              </span>
            </div>
          </div>

          {/* AI Reasoning */}
          {trade.aiReasoning && (
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-accent">AI Decision Reasoning</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trade.aiReasoning}
              </p>
            </div>
          )}

          {/* Transaction Hash & Actions */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-secondary/20 border border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono bg-background/50 px-3 py-2 rounded border border-border/50 truncate">
                  {trade.txHash}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyHash}
                  className="shrink-0"
                >
                  {copiedHash ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-border/50 hover:border-primary/50"
              onClick={() => window.open(explorerUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Cronos Explorer
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};