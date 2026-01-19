import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Filter,
  Search,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTradingStore } from '@/stores';
import {
  formatCurrency,
  formatPercent,
  formatRelativeTime,
} from '@/utils/formatters';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

type OpportunityStatus = 'detected' | 'analyzing' | 'executing' | 'completed' | 'rejected';
type FilterOption = 'all' | 'high-confidence' | 'analyzing' | 'executing';

interface Opportunity {
  id: string;
  pair: string;
  spread: number;
  netProfit: number;
  confidence: number;
  status: OpportunityStatus;
  timestamp: number;
  riskScore: number;
  cexPrice: number;
  dexPrice: number;
  estimatedGas: number;
  aiReasoning?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-success';
  if (confidence >= 60) return 'text-warning';
  return 'text-destructive';
}

function getConfidenceBgColor(confidence: number): string {
  if (confidence >= 80) return 'bg-success';
  if (confidence >= 60) return 'bg-warning';
  return 'bg-destructive';
}

// ============================================================================
// Sub-Components
// ============================================================================

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAnalyzing = opportunity.status === 'analyzing';
  const isExecuting = opportunity.status === 'executing';
  const isCompleted = opportunity.status === 'completed';
  const isRejected = opportunity.status === 'rejected';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-300 cursor-pointer',
        isAnalyzing && 'shimmer border-accent/30 bg-accent/5',
        isExecuting && 'executing-border border-primary/50 bg-primary/5',
        isCompleted && 'border-success/30 bg-success/5',
        isRejected && 'border-destructive/30 bg-destructive/5 opacity-60',
        !isAnalyzing && !isExecuting && !isCompleted && !isRejected &&
          'border-border bg-secondary/30 hover:border-primary/30 hover:shadow-lg'
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-base">
            {opportunity.pair}
          </span>
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-medium',
              isExecuting && 'border-primary text-primary',
              isAnalyzing && 'border-accent text-accent',
              isCompleted && 'border-success text-success',
              isRejected && 'border-destructive text-destructive'
            )}
          >
            {isAnalyzing ? (
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

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Spread</p>
          <p className="font-mono font-semibold text-success">
            {formatPercent(opportunity.spread)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Net Profit</p>
          <p className="font-mono font-semibold text-success">
            {formatCurrency(opportunity.netProfit)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Confidence</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 rounded-full flex-1 bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${opportunity.confidence}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={cn(
                  'h-full rounded-full',
                  getConfidenceBgColor(opportunity.confidence)
                )}
              />
            </div>
            <span
              className={cn(
                'font-mono text-xs font-semibold',
                getConfidenceColor(opportunity.confidence)
              )}
            >
              {opportunity.confidence}%
            </span>
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      {opportunity.riskScore > 50 && (
        <div className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 px-2 py-1.5 rounded mb-3">
          <AlertTriangle className="h-3 w-3" />
          <span className="font-medium">Elevated risk: {opportunity.riskScore}%</span>
        </div>
      )}

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 border-t border-border/50 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">CEX Price</p>
                  <p className="font-mono">${opportunity.cexPrice.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">DEX Price</p>
                  <p className="font-mono">${opportunity.dexPrice.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Gas</p>
                  <p className="font-mono">{formatCurrency(opportunity.estimatedGas)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <p className={cn(
                    'font-mono font-semibold',
                    opportunity.riskScore > 70 ? 'text-destructive' :
                    opportunity.riskScore > 40 ? 'text-warning' : 'text-success'
                  )}>
                    {opportunity.riskScore}%
                  </p>
                </div>
              </div>
              
              {opportunity.aiReasoning && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-1">AI Reasoning</p>
                  <p className="text-xs text-foreground/80 italic">
                    "{opportunity.aiReasoning}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground mb-1">
        Scanning for opportunities...
      </p>
      <p className="text-xs text-muted-foreground/70">
        AI is monitoring markets 24/7
      </p>
    </motion.div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function LiveOpportunityFeed() {
  const opportunities = useTradingStore((s) => s.opportunities);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search opportunities
  const filteredOpportunities = useMemo(() => {
    let filtered = [...opportunities];

    // Apply status filter
    if (filter === 'high-confidence') {
      filtered = filtered.filter((opp) => opp.confidence >= 80);
    } else if (filter === 'analyzing') {
      filtered = filtered.filter((opp) => opp.status === 'analyzing');
    } else if (filter === 'executing') {
      filtered = filtered.filter((opp) => opp.status === 'executing');
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((opp) =>
        opp.pair.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [opportunities, filter, searchQuery]);

  const activeCount = opportunities.filter((o) => 
    ['analyzing', 'executing'].includes(o.status)
  ).length;

  return (
    <Card className="glass-hover h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                Live Opportunities
              </CardTitle>
              {activeCount > 0 && (
                <Badge variant="secondary" className="font-mono text-xs animate-pulse">
                  {activeCount} Active
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9 h-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'high-confidence', 'analyzing', 'executing'] as FilterOption[]).map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => setFilter(f)}
                      className="h-7 text-xs"
                    >
                      {f === 'all' ? 'All' :
                       f === 'high-confidence' ? 'High Confidence' :
                       f === 'analyzing' ? 'Analyzing' : 'Executing'}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-3 max-h-125 overflow-y-auto pr-2">
          <AnimatePresence mode="popLayout">
            {filteredOpportunities.length === 0 ? (
              <EmptyState />
            ) : (
              filteredOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}