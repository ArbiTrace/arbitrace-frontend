import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTradingStore } from '@/stores';
import { formatCurrency, formatPercent, formatRelativeTime } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export function LiveOpportunityFeed() {
  const opportunities = useTradingStore((s) => s.opportunities);

  return (
    <Card className="glass-hover h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            Live Opportunities
          </CardTitle>
          <Badge variant="secondary" className="font-mono text-xs">
            {opportunities.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {opportunities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Scanning for opportunities...</p>
            </div>
          ) : (
            opportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <OpportunityCard opportunity={opp} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

interface OpportunityCardProps {
  opportunity: {
    id: string;
    pair: string;
    spread: number;
    netProfit: number;
    confidence: number;
    status: string;
    timestamp: number;
    riskScore: number;
  };
}

function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const isAnalyzing = opportunity.status === 'analyzing';
  const isExecuting = opportunity.status === 'executing';

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-300',
        isAnalyzing && 'shimmer border-accent/30 bg-accent/5',
        isExecuting && 'executing-border border-primary/50 bg-primary/5',
        !isAnalyzing && !isExecuting && 'border-border bg-secondary/30 hover:border-primary/30'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold">{opportunity.pair}</span>
          <Badge
            variant="outline"
            className={cn(
              'text-xs',
              opportunity.status === 'executing' && 'border-primary text-primary',
              opportunity.status === 'analyzing' && 'border-accent text-accent',
              opportunity.status === 'detected' && 'border-muted-foreground'
            )}
          >
            {opportunity.status === 'analyzing' ? (
              <span className="flex items-center gap-1">
                <Brain className="h-3 w-3 animate-pulse" />
                AI Analyzing
              </span>
            ) : (
              opportunity.status
            )}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(opportunity.timestamp)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Spread</p>
          <p className="font-mono text-success">{formatPercent(opportunity.spread)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Est. Profit</p>
          <p className="font-mono text-success">{formatCurrency(opportunity.netProfit)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Confidence</p>
          <div className="flex items-center gap-1">
            <div
              className={cn(
                'h-1.5 rounded-full flex-1',
                'bg-secondary'
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  opportunity.confidence >= 80 ? 'bg-success' : 
                  opportunity.confidence >= 60 ? 'bg-warning' : 'bg-destructive'
                )}
                style={{ width: `${opportunity.confidence}%` }}
              />
            </div>
            <span className="font-mono text-xs">{opportunity.confidence}%</span>
          </div>
        </div>
      </div>

      {opportunity.riskScore > 50 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-warning">
          <AlertTriangle className="h-3 w-3" />
          <span>Elevated risk detected</span>
        </div>
      )}
    </div>
  );
}
