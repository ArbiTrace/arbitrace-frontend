import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { StrategySelector, RiskLimitsForm, BacktestPanel } from '@/components/strategy';
import { Settings2, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStrategyStore } from '@/stores';
import { useWebSocket } from '@/hooks/useWebSocket';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const Strategy = () => {
  const { activeStrategy, strategies } = useStrategyStore();
  const { isConnected } = useWebSocket();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!activeStrategy) {
      toast.error('No strategy selected');
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate saving to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('✅ Strategy saved successfully!', {
        icon: '💾',
        duration: 4000,
      });
      
      // TODO: Send strategy config to agent backend
      // socket.emit('strategy:update', activeStrategy);
    } catch (error) {
      toast.error('Failed to save strategy');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!activeStrategy) return;
    
    const originalStrategy = strategies.find(s => s.id === activeStrategy.id);
    if (originalStrategy) {
      useStrategyStore.getState().setActiveStrategy(originalStrategy);
      toast('🔄 Strategy reset to defaults', {
        icon: 'ℹ️',
        duration: 3000,
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Settings2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Strategy Configuration
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure your trading strategy and risk parameters
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
            
            {/* Action Buttons */}
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!activeStrategy}
              className="border-border/50 hover:border-primary/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!activeStrategy || isSaving}
              className={cn(
                'bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric',
                isSaving && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Strategy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Warning Banner if no strategy selected */}
        {!activeStrategy && (
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-warning">No Strategy Selected</p>
              <p className="text-xs text-warning/80 mt-1">
                Please select a strategy template below to begin configuration.
              </p>
            </div>
          </div>
        )}

        {/* Active Strategy Info */}
        {activeStrategy && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Strategy</p>
                <p className="font-medium text-foreground">{activeStrategy.name}</p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 capitalize">
                {activeStrategy.riskLevel} Risk
              </Badge>
            </div>
          </div>
        )}

        {/* Strategy Selection */}
        <StrategySelector />

        {/* Configuration Grid */}
        {activeStrategy && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskLimitsForm />
            <BacktestPanel />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Strategy;