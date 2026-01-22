import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

/**
 * Format a number with sign prefix (+/-)
 */
export function formatSignedCurrency(value: number, currency: string = 'USD'): string {
  const formatted = formatCurrency(Math.abs(value), currency);
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

/**
 * Format a percentage value
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${(value).toFixed(decimals)}%`;
}

/**
 * Format a number with compact notation (1.2K, 1.5M, etc.)
 */
export function formatCompact(value: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
  return formatter.format(value);
}

/**
 * Format a number with specified decimals
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a crypto amount (8 decimal places for small values)
 */
export function formatCrypto(value: number, symbol?: string): string {
  const decimals = value < 0.001 ? 8 : value < 1 ? 6 : 4;
  const formatted = formatNumber(value, decimals);
  return symbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Format a timestamp to readable date/time
 */
export function formatDateTime(timestamp: number): string {
  return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
}

/**
 * Format a timestamp to time only
 */
export function formatTime(timestamp: number): string {
  return format(new Date(timestamp), 'HH:mm:ss');
}

/**
 * Format a timestamp to date only
 */
export function formatDate(timestamp: number): string {
  return format(new Date(timestamp), 'MMM dd, yyyy');
}

/**
 * Format a timestamp to short time (HH:mm)
 */
export function formatShortTime(timestamp: number): string {
  return format(new Date(timestamp), 'HH:mm');
}

/**
 * Format a timestamp as relative time (e.g., "5 minutes ago")
 */
export function formatRelativeTime(timestamp: number): string {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

/**
 * Format milliseconds to readable duration
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}

/**
 * Format uptime in hours/days
 */
export function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

/**
 * Format wallet address (truncate middle)
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format transaction hash (truncate)
 */
export function formatTxHash(hash: string, chars: number = 6): string {
  if (!hash || hash.length < chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

/**
 * Format gas price in Gwei
 */
export function formatGasPrice(gwei: number): string {
  return `${gwei.toFixed(1)} Gwei`;
}
