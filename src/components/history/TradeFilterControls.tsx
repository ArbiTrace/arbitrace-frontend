import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Download, Filter } from 'lucide-react';
import { useUIStore } from '@/stores';
import { TradeFilters } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const pairs = ['All Pairs', 'CRO/USDC', 'ETH/USDC', 'WBTC/USDC', 'VVS/USDC'];
const statuses = ['All Status', 'success', 'failed', 'pending'];
const dateRanges = ['All Time', '24 Hours', '7 Days', '30 Days', '90 Days'];
const aiConfidenceRanges = ['All', '0-50%', '50-70%', '70-85%', '85-100%'];

interface TradeFilterControlsProps {
  onExport: () => void;
}

export const TradeFilterControls = ({ onExport }: TradeFilterControlsProps) => {
  const { tradeFilters, setTradeFilters, clearTradeFilters } = useUIStore();
  const [searchValue, setSearchValue] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearch = () => {
    if (searchValue.trim()) {
      setTradeFilters({ ...tradeFilters, search: searchValue });
    }
  };

  const handlePairChange = (value: string) => {
    if (value === 'All Pairs') {
      const { pair, ...rest } = tradeFilters;
      setTradeFilters(rest);
    } else {
      setTradeFilters({ ...tradeFilters, pair: value });
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === 'All Status') {
      const { status, ...rest } = tradeFilters;
      setTradeFilters(rest);
    } else {
      setTradeFilters({ ...tradeFilters, status: value as TradeFilters['status'] });
    }
  };

  const handleDateRangeChange = (value: string) => {
    const now = Date.now();
    let dateFrom: number | undefined;
    
    switch (value) {
      case '24 Hours':
        dateFrom = now - 24 * 60 * 60 * 1000;
        break;
      case '7 Days':
        dateFrom = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case '30 Days':
        dateFrom = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case '90 Days':
        dateFrom = now - 90 * 24 * 60 * 60 * 1000;
        break;
      default:
        dateFrom = undefined;
    }
    
    setTradeFilters({ ...tradeFilters, dateFrom, dateTo: dateFrom ? now : undefined });
  };

  const handleAIConfidenceChange = (value: string) => {
    if (value === 'All') {
      const { minAIConfidence, ...rest } = tradeFilters;
      setTradeFilters(rest);
    } else {
      const confidenceMap: Record<string, number> = {
        '0-50%': 0,
        '50-70%': 50,
        '70-85%': 70,
        '85-100%': 85,
      };
      setTradeFilters({ ...tradeFilters, minAIConfidence: confidenceMap[value] });
    }
  };

  const hasActiveFilters = Object.keys(tradeFilters).length > 0;
  const filterCount = Object.keys(tradeFilters).length;

  return (
    <div className="glass-card p-4 rounded-xl space-y-4">
      {/* Main Filters Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by transaction hash, pair, or trade ID..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
          />
        </div>

        {/* Pair Filter */}
        <Select onValueChange={handlePairChange} defaultValue="All Pairs">
          <SelectTrigger className="w-full md:w-[160px] bg-secondary/50 border-border/50">
            <SelectValue placeholder="Token Pair" />
          </SelectTrigger>
          <SelectContent>
            {pairs.map((pair) => (
              <SelectItem key={pair} value={pair}>
                {pair}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select onValueChange={handleStatusChange} defaultValue="All Status">
          <SelectTrigger className="w-full md:w-[140px] bg-secondary/50 border-border/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'All Status' ? status : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Select onValueChange={handleDateRangeChange} defaultValue="All Time">
          <SelectTrigger className="w-full md:w-[140px] bg-secondary/50 border-border/50">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full md:w-auto gap-2"
        >
          <Filter className="w-4 h-4" />
          {showAdvanced ? 'Hide' : 'More'}
          {filterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-border/50">
              <p className="text-sm font-medium text-muted-foreground mb-3">Advanced Filters</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* AI Confidence Filter */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    AI Confidence Range
                  </label>
                  <Select onValueChange={handleAIConfidenceChange} defaultValue="All">
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="AI Confidence" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiConfidenceRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Profit Filter (Placeholder) */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    Minimum Profit (USD)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="bg-secondary/50 border-border/50"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        // TODO: Add minProfit to TradeFilters type
                        console.log('Min profit filter:', value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-border/50">
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearTradeFilters}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {hasActiveFilters && (
            <span>{filterCount} filter{filterCount !== 1 ? 's' : ''} active</span>
          )}
        </div>
      </div>
    </div>
  );
};