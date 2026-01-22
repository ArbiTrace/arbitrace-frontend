import { useEffect, useState } from 'react';
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useDisconnect, useBalance } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatAddress, formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

// ============================================================================
// Types
// ============================================================================

interface WalletButtonProps {
  variant?: 'default' | 'header' | 'hero';
  showBalance?: boolean;
  className?: string;
}

// ============================================================================
// Sub-Components
// ============================================================================

function NetworkBadge({ chainId }: { chainId?: number }) {
  const networkName = chainId === 25 ? 'Cronos' : chainId === 338 ? 'Cronos Testnet' : 'Unknown';
  const isCorrectNetwork = chainId === 25 || chainId === 338;

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs',
        isCorrectNetwork
          ? 'bg-success/10 text-success border-success/20'
          : 'bg-warning/10 text-warning border-warning/20'
      )}
    >
      {isCorrectNetwork ? networkName : 'Wrong Network'}
    </Badge>
  );
}

function WalletDropdownContent({
  address,
  chainId,
  balance,
  onDisconnect,
}: {
  address: string;
  chainId?: number;
  balance?: string;
  onDisconnect: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const { open: openNetworkModal } = useAppKit();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewExplorer = () => {
    const explorerUrl =
      chainId === 25
        ? `https://cronoscan.com/address/${address}`
        : `https://testnet.cronoscan.com/address/${address}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <DropdownMenuContent align="end" className="w-64">
      <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
      <DropdownMenuSeparator />

      {/* Network */}
      <div className="px-2 py-2">
        <p className="text-xs text-muted-foreground mb-1">Network</p>
        <NetworkBadge chainId={chainId} />
        {chainId !== 25 && chainId !== 338 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openNetworkModal()}
            className="w-full mt-2 h-7 text-xs gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            Switch Network
          </Button>
        )}
      </div>

      <DropdownMenuSeparator />

      {/* Balance */}
      {balance && (
        <>
          <div className="px-2 py-2">
            <p className="text-xs text-muted-foreground mb-1">Balance</p>
            <p className="font-mono font-semibold text-sm">{balance}</p>
          </div>
          <DropdownMenuSeparator />
        </>
      )}

      {/* Address */}
      <div className="px-2 py-2">
        <p className="text-xs text-muted-foreground mb-1">Address</p>
        <code className="text-xs bg-secondary px-2 py-1 rounded font-mono block">
          {formatAddress(address)}
        </code>
      </div>

      <DropdownMenuSeparator />

      {/* Actions */}
      <DropdownMenuItem onClick={handleCopy} className="gap-2 cursor-pointer">
        {copied ? (
          <>
            <Check className="h-4 w-4 text-success" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy Address
          </>
        )}
      </DropdownMenuItem>

      <DropdownMenuItem onClick={handleViewExplorer} className="gap-2 cursor-pointer">
        <ExternalLink className="h-4 w-4" />
        View on Explorer
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={onDisconnect}
        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Disconnect
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function WalletButton({
  variant = 'default',
  showBalance = true,
  className,
}: WalletButtonProps) {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { disconnect } = useDisconnect();

  // Fetch CRO balance
  const { data: balanceData } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId,
  });

  const formattedBalance = balanceData
    ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}`
    : undefined;

  const handleConnect = () => {
    open();
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  // Show toast when network changes
  useEffect(() => {
    if (isConnected && chainId) {
      if (chainId !== 25 && chainId !== 338) {
        toast.error('Please switch to Cronos network');
      }
    }
  }, [chainId, isConnected]);

  // Not connected state
  if (!isConnected || !address) {
    return (
      <Button
        onClick={handleConnect}
        variant={variant === 'hero' ? 'default' : 'outline'}
        size={variant === 'hero' ? 'lg' : 'sm'}
        className={cn(
          'gap-2 group cursor-pointer',
          variant === 'default' &&
            'bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric',
          variant === 'hero' &&
            'bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric text-lg px-8',
          className
        )}
      >
        <Wallet className={cn('transition-transform group-hover:scale-110', 
          variant === 'hero' ? 'h-5 w-5' : 'h-4 w-4'
        )} />
        <span>Connect Wallet</span>
      </Button>
    );
  }

  // Connected state - Header variant (dropdown)
  if (variant === 'header') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={cn('gap-2', className)}>
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline font-mono">
              {formatAddress(address)}
            </span>
            {showBalance && formattedBalance && (
              <span className="hidden lg:inline text-xs text-muted-foreground">
                {formattedBalance.split(' ')[0]} CRO
              </span>
            )}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <WalletDropdownContent
          address={address}
          chainId={chainId}
          balance={formattedBalance}
          onDisconnect={handleDisconnect}
        />
      </DropdownMenu>
    );
  }

  // Connected state - Default/Hero variant (simple button)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={variant === 'hero' ? 'lg' : 'sm'}
          className={cn('gap-2', className)}
        >
          <Wallet className={variant === 'hero' ? 'h-5 w-5' : 'h-4 w-4'} />
          <span className="font-mono">
            {formatAddress(address)}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <WalletDropdownContent
        address={address}
        chainId={chainId}
        balance={formattedBalance}
        onDisconnect={handleDisconnect}
      />
    </DropdownMenu>
  );
}