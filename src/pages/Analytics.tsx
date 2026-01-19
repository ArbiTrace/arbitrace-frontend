import { Layout } from '@/components/layout/Layout';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';
import { MetricsGrid } from '@/components/analytics/MetricsGrid';
import { TradeDistribution } from '@/components/analytics/TradeDistribution';
import { HourlyHeatmap } from '@/components/analytics/HourlyHeatmap';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Performance Analytics
            </h1>
            <p className="text-muted-foreground">
              Deep dive into your trading performance and metrics
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <MetricsGrid />

        {/* Performance Chart */}
        <PerformanceChart />

        {/* Distribution & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TradeDistribution />
          <HourlyHeatmap />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
