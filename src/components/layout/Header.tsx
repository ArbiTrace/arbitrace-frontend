import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard,
  Settings2,
  BarChart3,
  History,
  Settings,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/WalletButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { useTradingStore } from '@/stores';

// ============================================================================
// Constants
// ============================================================================

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/strategy', label: 'Strategy', icon: Settings2 },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/history', label: 'History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
] as const;

// ============================================================================
// Helper Functions
// ============================================================================

function getStatusConfig(status: string) {
  const configs = {
    active: {
      color: 'bg-success',
      pulse: 'pulse-success',
      label: 'Active',
    },
    paused: {
      color: 'bg-warning',
      pulse: 'pulse-warning',
      label: 'Paused',
    },
    error: {
      color: 'bg-destructive',
      pulse: 'pulse-error',
      label: 'Error',
    },
  };

  return configs[status as keyof typeof configs] || configs.paused;
}

// ============================================================================
// Sub-Components
// ============================================================================

function AgentStatusBadge({ status }: { status: string }) {
  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border backdrop-blur-sm"
    >
      <div className={cn('h-2 w-2 rounded-full', config.color, config.pulse)} />
      <span className="text-xs font-medium">{config.label}</span>
    </motion.div>
  );
}

function NavigationLinks() {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className={cn(
                'gap-2 transition-all relative',
                isActive && 'bg-secondary border border-primary/20'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="container px-4 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                  >
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-2',
                        isActive && 'bg-secondary border border-primary/20'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function Header() {
  const agentStatus = useTradingStore((s) => s.agentStatus);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Zap className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 blur-md bg-primary/30 rounded-full transition-opacity group-hover:opacity-50" />
          </div>
          <span className="font-display text-xl font-bold text-gradient-cyan">
            ArbiTrace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationLinks />

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Agent Status Badge */}
          <AgentStatusBadge status={agentStatus.status} />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Wallet Button */}
          <WalletButton variant="header" showBalance />

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}