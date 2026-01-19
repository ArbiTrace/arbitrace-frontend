import { useStrategyStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

export const RiskLimitsForm = () => {
  const { activeStrategy, updateStrategy } = useStrategyStore();

  if (!activeStrategy) return null;

  const handleSliderChange = (field: string, value: number[]) => {
    updateStrategy({ [field]: value[0] });
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateStrategy({ [field]: numValue });
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Risk Limits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Min Profit Threshold */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Minimum Profit Threshold</Label>
            <span className="font-mono text-primary">
              {(activeStrategy.minProfitThreshold * 100).toFixed(1)}%
            </span>
          </div>
          <Slider
            value={[activeStrategy.minProfitThreshold * 100]}
            onValueChange={(v) => handleSliderChange('minProfitThreshold', [v[0] / 100])}
            min={0.1}
            max={3}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Minimum spread required to execute a trade
          </p>
        </div>

        {/* Max Position Size */}
        <div className="space-y-3">
          <Label>Maximum Position Size (USD)</Label>
          <Input
            type="number"
            value={activeStrategy.maxPositionSize}
            onChange={(e) => handleInputChange('maxPositionSize', e.target.value)}
            className="font-mono bg-secondary/50 border-border/50 focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            Maximum amount per trade
          </p>
        </div>

        {/* Max Daily Loss */}
        <div className="space-y-3">
          <Label>Maximum Daily Loss (USD)</Label>
          <Input
            type="number"
            value={activeStrategy.maxDailyLoss}
            onChange={(e) => handleInputChange('maxDailyLoss', e.target.value)}
            className="font-mono bg-secondary/50 border-border/50 focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            Agent pauses when daily loss limit is reached
          </p>
        </div>

        {/* Stop Loss */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Stop Loss</Label>
            <span className="font-mono text-destructive">
              {(activeStrategy.stopLossPercent * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[activeStrategy.stopLossPercent * 100]}
            onValueChange={(v) => handleSliderChange('stopLossPercent', [v[0] / 100])}
            min={1}
            max={15}
            step={1}
            className="w-full"
          />
        </div>

        {/* Slippage Tolerance */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Slippage Tolerance</Label>
            <span className="font-mono text-foreground">
              {(activeStrategy.slippageTolerance * 100).toFixed(1)}%
            </span>
          </div>
          <Slider
            value={[activeStrategy.slippageTolerance * 100]}
            onValueChange={(v) => handleSliderChange('slippageTolerance', [v[0] / 100])}
            min={0.1}
            max={5}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Consecutive Loss Limit */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Consecutive Loss Limit</Label>
            <span className="font-mono text-foreground">
              {activeStrategy.consecutiveLossLimit} trades
            </span>
          </div>
          <Slider
            value={[activeStrategy.consecutiveLossLimit]}
            onValueChange={(v) => handleSliderChange('consecutiveLossLimit', v)}
            min={2}
            max={10}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Pause after this many consecutive losing trades
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
