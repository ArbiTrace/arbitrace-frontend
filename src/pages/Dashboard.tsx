import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PortfolioOverview, RiskMonitor, RecentTradesTable, AgentStatusCard, LiveOpportunityFeed, ProfitLossChart } from '@/components/dashboard';
import { useTradingStore } from '@/stores';
import { useWebSocket } from '@/hooks/useWebSocket';
// import { useContractEvents } from '@/hooks/useContractEvents';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// ============================================================================
// Loading States
// ============================================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Portfolio Overview Skeleton */}
      <Skeleton className="h-50 w-full rounded-xl" />

      {/* Status Cards Row Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-75 rounded-xl" />
        <Skeleton className="h-75 rounded-xl" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-100 lg:col-span-1 rounded-xl" />
        <Skeleton className="h-100 lg:col-span-2 rounded-xl" />
      </div>

      {/* Recent Trades Skeleton */}
      <Skeleton className="h-125 w-full rounded-xl" />
    </div>
  );
}

// ============================================================================
// Connection Status Banner
// ============================================================================

function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-success/10 border border-success/30 rounded-lg px-4 py-3 flex items-center gap-3"
      >
        <Wifi className="h-4 w-4 text-success" />
        <p className="text-sm text-success font-medium">
          Connected to agent • Live data streaming
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3 flex items-center gap-3"
    >
      <WifiOff className="h-4 w-4 text-warning" />
      <div className="flex-1">
        <p className="text-sm text-warning font-medium">
          Reconnecting to agent...
        </p>
        <p className="text-xs text-warning/70 mt-0.5">
          Real-time updates are temporarily unavailable
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Main Dashboard Component
// ============================================================================

export default function Dashboard() {
  const { 
    agentStatus, 
    isConnectedToAgent,
    initializeMockData, // Only for initial demo data
  } = useTradingStore();
  
  const { isConnected: isWebSocketConnected } = useWebSocket();
  
  // ✅ Initialize contract event listeners
  // useContractEvents();

  useEffect(() => {
    // Initialize with mock data only if no real data exists
    // This will be replaced by real data as soon as WebSocket connects
    if (!isConnectedToAgent) {
      initializeMockData();
    }
  }, [isConnectedToAgent, initializeMockData]);

  // Show loading state only on initial mount
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Remove loading state after a brief delay
    const timer = setTimeout(() => setIsInitialLoad(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoad) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Connection Status Banner */}
        <motion.div variants={itemVariants}>
          <ConnectionStatus isConnected={isWebSocketConnected} />
        </motion.div>

        {/* Portfolio Overview Hero - Now with contract integration */}
        <motion.div variants={itemVariants}>
          <PortfolioOverview />
        </motion.div>

        {/* Agent Status & Risk Monitor Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <AgentStatusCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <RiskMonitor />
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Opportunity Feed */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <LiveOpportunityFeed />
          </motion.div>

          {/* Right Column: P&L Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <ProfitLossChart />
          </motion.div>
        </div>

        {/* Recent Trades Table - Now listening to contract events */}
        <motion.div variants={itemVariants}>
          <RecentTradesTable />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground py-4 border-t border-border/30"
        >
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Agent:</span>
              <span className={cn(
                'font-medium',
                agentStatus.status === 'active' && 'text-success',
                agentStatus.status === 'paused' && 'text-warning',
                agentStatus.status === 'error' && 'text-destructive',
              )}>
                {agentStatus.status.charAt(0).toUpperCase() + agentStatus.status.slice(1)}
              </span>
            </div>
            
            {agentStatus.aiEngine && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">AI Engine:</span>
                <span className="font-medium text-foreground">
                  {agentStatus.aiEngine}
                </span>
              </div>
            )}
            
            {agentStatus.lastUpdate && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Last Update:</span>
                <span className="font-medium text-foreground font-mono">
                  {new Date(agentStatus.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}