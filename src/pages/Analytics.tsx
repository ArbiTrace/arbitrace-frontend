import { Layout } from "@/components/layout/Layout";
import {
  PerformanceChart,
  MetricsGrid,
  TradeDistribution,
  HourlyHeatmap,
} from "@/components/analytics";
import { BarChart3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTradingStore } from "@/stores";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState } from "react";
import { motion } from "framer-motion";

const Analytics = () => {
  const { trades, performanceMetrics } = useTradingStore();
  const { isConnected } = useWebSocket();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Performance Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Deep dive into your trading performance and metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection Status */}
            {!isConnected && (
              <Badge variant="outline" className="gap-1.5 bg-warning/10 text-warning border-warning/20">
                <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                Agent Offline
              </Badge>
            )}

            {/* Data Stats */}
            <Badge variant="outline" className="font-mono">
              {trades.length} trades analyzed
            </Badge>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* No Data Warning */}
        {trades.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3"
          >
            <BarChart3 className="h-5 w-5 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-warning">No trading data yet</p>
              <p className="text-xs text-warning/80 mt-1">
                Start trading or wait for the agent to execute trades. Analytics will update automatically.
              </p>
            </div>
          </motion.div>
        )}

        {/* Key Metrics Grid */}
        <MetricsGrid />

        {/* Performance Chart */}
        <PerformanceChart />

        {/* Distribution & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradeDistribution />
          <HourlyHeatmap />
        </div>

        {/* Footer Stats */}
        <div className="text-center text-sm text-muted-foreground py-4 border-t border-border/30">
          <p>
            Analytics based on {trades.length} total trades • 
            Win Rate: {performanceMetrics.winRate.toFixed(1)}% • 
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;