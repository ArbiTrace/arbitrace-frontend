import { Layout } from '@/components/layout/Layout';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { LiveOpportunityFeed } from '@/components/dashboard/LiveOpportunityFeed';
import { ProfitLossChart } from '@/components/dashboard/ProfitLossChart';
import { RecentTradesTable } from '@/components/dashboard/RecentTradesTable';

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Portfolio Overview Hero */}
        <PortfolioOverview />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Opportunity Feed */}
          <div className="lg:col-span-1">
            <LiveOpportunityFeed />
          </div>

          {/* Right: P&L Chart */}
          <div className="lg:col-span-2">
            <ProfitLossChart />
          </div>
        </div>

        {/* Recent Trades */}
        <RecentTradesTable />
      </div>
    </Layout>
  );
};

export default Index;
