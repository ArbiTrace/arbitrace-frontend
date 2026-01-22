import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Download } from 'lucide-react';
import { useUIStore } from '@/stores';
import { TradeFilters } from '@/types';

const pairs = ['All Pairs', 'CRO/USDC', 'ETH/USDC', 'WBTC/USDC', 'VVS/USDC'];
const statuses = ['All Status', 'success', 'failed', 'pending'];
const dateRanges = ['All Time', '24 Hours', '7 Days', '30 Days', '90 Days'];

interface TradeFilterControlsProps {
  onExport: () => void;
}

export const TradeFilterControls = ({ onExport }: TradeFilterControlsProps) => {
  const { tradeFilters, setTradeFilters, clearTradeFilters } = useUIStore();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    setTradeFilters({ ...tradeFilters, search: searchValue });
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

  const hasActiveFilters = Object.keys(tradeFilters).length > 0;

  return (
    <div className="glass-card p-4 rounded-xl space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by transaction hash..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>

        {/* Pair Filter */}
        <Select onValueChange={handlePairChange} defaultValue="All Pairs">
          <SelectTrigger className="w-[160px] bg-secondary/50 border-border/50">
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
          <SelectTrigger className="w-[140px] bg-secondary/50 border-border/50">
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
          <SelectTrigger className="w-[140px] bg-secondary/50 border-border/50">
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
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearTradeFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="border-border/50 hover:border-primary/50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};
