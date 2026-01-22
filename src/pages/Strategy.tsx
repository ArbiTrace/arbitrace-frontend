import { Layout } from '@/components/layout/Layout';
import { StrategySelector } from '@/components/strategy/StrategySelector';
import { RiskLimitsForm } from '@/components/strategy/RiskLimitsForm';
import { BacktestPanel } from '@/components/strategy/BacktestPanel';
import { Settings2, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStrategyStore } from '@/stores';
import { toast } from 'sonner';

const Strategy = () => {
  const { activeStrategy } = useStrategyStore();

  const handleSave = () => {
    toast.success('Strategy saved successfully!', {
      description: `${activeStrategy?.name} is now your active strategy`,
    });
  };

  const handleReset = () => {
    toast.info('Strategy reset to defaults');
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Settings2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Strategy Configuration
              </h1>
              <p className="text-muted-foreground">
                Configure your trading strategy and risk parameters
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-border/50 hover:border-primary/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Strategy
            </Button>
          </div>
        </div>

        {/* Strategy Selection */}
        <StrategySelector />

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskLimitsForm />
          <BacktestPanel />
        </div>
      </div>
    </Layout>
  );
};

export default Strategy;
