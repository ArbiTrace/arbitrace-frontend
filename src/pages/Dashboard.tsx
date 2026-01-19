import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { LiveOpportunityFeed } from '@/components/dashboard/LiveOpportunityFeed';
import { ProfitLossChart } from '@/components/dashboard/ProfitLossChart';
import { RecentTradesTable } from '@/components/dashboard/RecentTradesTable';
import { AgentStatusCard } from '@/components/dashboard/AgentStatusCard';
import { RiskMonitor } from '@/components/dashboard/RiskMonitor';
import { useTradingStore } from '@/stores';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Skeleton } from '@/components/ui/skeleton';

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
      <Skeleton className="h-[180px] w-full rounded-xl" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] lg:col-span-1 rounded-xl" />
        <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
      </div>

      {/* Recent Trades Skeleton */}
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  );
}

// ============================================================================
// Main Dashboard Component
// ============================================================================

export default function Dashboard() {
  const { isLoading, initializeData, agentStatus } = useTradingStore();
  const { isConnected: isWebSocketConnected } = useWebSocket();

  useEffect(() => {
    // Initialize dashboard data
    initializeData();
  }, [initializeData]);

  if (isLoading) {
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
        {/* WebSocket Status Indicator */}
        {!isWebSocketConnected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-3 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <p className="text-sm text-warning font-medium">
              Reconnecting to live data feed...
            </p>
          </motion.div>
        )}

        {/* Portfolio Overview Hero */}
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

        {/* Recent Trades Table */}
        <motion.div variants={itemVariants}>
          <RecentTradesTable />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground py-4"
        >
          <p>
            Agent Status: <span className="text-foreground font-medium">{agentStatus.status}</span>
            {' • '}
            Last Updated: <span className="text-foreground font-medium">
              {new Date(agentStatus.lastUpdate).toLocaleTimeString()}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </Layout>
  );
}