import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Settings2, 
  BarChart3, 
  History, 
  Settings,
  Wallet,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTradingStore, useUIStore, useWalletStore } from '@/stores';
import { formatAddress } from '@/utils/formatters';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/strategy', label: 'Strategy', icon: Settings2 },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/history', label: 'History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Header() {
  const location = useLocation();
  const agentStatus = useTradingStore((s) => s.agentStatus);
  const { isConnected, address } = useWalletStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const statusColor = {
    active: 'bg-success',
    paused: 'bg-warning',
    error: 'bg-destructive',
  }[agentStatus.status];

  const statusPulse = {
    active: 'pulse-success',
    paused: 'pulse-warning',
    error: 'pulse-error',
  }[agentStatus.status];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <Zap className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 blur-sm bg-primary/30 rounded-full" />
          </div>
          <span className="font-display text-xl font-bold text-gradient-cyan">
            ArbiTrace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2 transition-all',
                    isActive && 'bg-secondary border border-primary/20'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Agent Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
            <div className={cn('h-2 w-2 rounded-full', statusColor, statusPulse)} />
            <span className="text-xs font-medium capitalize">
              {agentStatus.status}
            </span>
          </div>

          {/* Wallet Button */}
          <Button
            variant={isConnected ? 'outline' : 'default'}
            size="sm"
            className={cn(
              'gap-2',
              !isConnected && 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-glow'
            )}
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isConnected && address ? formatAddress(address) : 'Connect Wallet'}
            </span>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-background p-4"
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </header>
  );
}
