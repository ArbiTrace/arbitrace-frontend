import { useStrategyStore, useTradingStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RiskLimitsFormProps {
  onParameterChange?: () => void;
  disabled?: boolean;
}

export const RiskLimitsForm = ({ onParameterChange, disabled }: RiskLimitsFormProps) => {
  const { activeStrategy, updateStrategy } = useStrategyStore();
  const { agentStatus } = useTradingStore();

  if (!activeStrategy) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-3" />
          <p className="text-muted-foreground">
            Select a strategy to configure risk parameters
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSliderChange = (field: string, value: number[]) => {
    if (disabled) return;
    updateStrategy({ [field]: value[0] });
    onParameterChange?.();
  };

  const handleInputChange = (field: string, value: string) => {
    if (disabled) return;
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      updateStrategy({ [field]: numValue });
      onParameterChange?.();
    }
  };

  // Helper to show if current value exceeds agent's configured limits
  const isAboveAgentLimit = (value: number, limit: number | undefined) => {
    return limit && value > limit;
  };

  return (
    <Card className={cn("glass-card", disabled && "opacity-70")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Risk Limits
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Configure safety parameters for automated trading
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Min Profit Threshold */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label>Minimum Profit Threshold</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      Minimum spread required to execute a trade. Higher values mean
                      more selective trading but potentially higher profits per trade.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className={cn(
              "font-mono font-semibold",
              activeStrategy.minProfitThreshold >= 0.01 ? "text-success" : "text-warning"
            )}>
              {(activeStrategy.minProfitThreshold * 100).toFixed(1)}%
            </span>
          </div>
          <Slider
            value={[activeStrategy.minProfitThreshold * 100]}
            onValueChange={(v) => handleSliderChange('minProfitThreshold', [v[0] / 100])}
            min={0.1}
            max={3}
            step={0.1}
            disabled={disabled}
            className={cn("w-full", disabled && "opacity-50 cursor-not-allowed")}
          />
          <p className="text-xs text-muted-foreground">
            Range: 0.1% - 3.0% • Recommended: 0.5% - 1.0%
          </p>
        </div>

        {/* Max Position Size */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Label>Maximum Position Size (USD)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      Maximum amount of capital to risk per single trade.
                      Never risk more than you can afford to lose.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {agentStatus.config?.maxPositionSize && 
             isAboveAgentLimit(activeStrategy.maxPositionSize, agentStatus.config.maxPositionSize) && (
              <span className="text-xs text-warning">
                Exceeds agent limit: ${agentStatus.config.maxPositionSize}
              </span>
            )}
          </div>
          <Input
            type="number"
            value={activeStrategy.maxPositionSize}
            onChange={(e) => handleInputChange('maxPositionSize', e.target.value)}
            disabled={disabled}
            className={cn(
              "font-mono bg-secondary/50 border-border/50 focus:border-primary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          <p className="text-xs text-muted-foreground">
            Recommended: $100 - $1,000 for beginners
          </p>
        </div>

        {/* Max Daily Loss */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Maximum Daily Loss (USD)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Agent automatically pauses when this loss limit is reached.
                    Protects your capital during unfavorable market conditions.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            type="number"
            value={activeStrategy.maxDailyLoss}
            onChange={(e) => handleInputChange('maxDailyLoss', e.target.value)}
            disabled={disabled}
            className={cn(
              "font-mono bg-secondary/50 border-border/50 focus:border-primary",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          <p className="text-xs text-muted-foreground">
            Recommended: 5-10% of your total portfolio
          </p>
        </div>

        {/* Stop Loss */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Stop Loss Percentage</Label>
            <span className="font-mono text-destructive font-semibold">
              {(activeStrategy.stopLossPercent * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[activeStrategy.stopLossPercent * 100]}
            onValueChange={(v) => handleSliderChange('stopLossPercent', [v[0] / 100])}
            min={1}
            max={15}
            step={1}
            disabled={disabled}
            className={cn("w-full", disabled && "opacity-50 cursor-not-allowed")}
          />
          <p className="text-xs text-muted-foreground">
            Exit trade if loss exceeds this percentage
          </p>
        </div>

        {/* Slippage Tolerance */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Slippage Tolerance</Label>
            <span className="font-mono text-foreground font-semibold">
              {(activeStrategy.slippageTolerance * 100).toFixed(1)}%
            </span>
          </div>
          <Slider
            value={[activeStrategy.slippageTolerance * 100]}
            onValueChange={(v) => handleSliderChange('slippageTolerance', [v[0] / 100])}
            min={0.1}
            max={5}
            step={0.1}
            disabled={disabled}
            className={cn("w-full", disabled && "opacity-50 cursor-not-allowed")}
          />
          <p className="text-xs text-muted-foreground">
            Maximum acceptable price movement during execution
          </p>
        </div>

        {/* Consecutive Loss Limit */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Consecutive Loss Limit</Label>
            <span className="font-mono text-foreground font-semibold">
              {activeStrategy.consecutiveLossLimit} trades
            </span>
          </div>
          <Slider
            value={[activeStrategy.consecutiveLossLimit]}
            onValueChange={(v) => handleSliderChange('consecutiveLossLimit', v)}
            min={2}
            max={10}
            step={1}
            disabled={disabled}
            className={cn("w-full", disabled && "opacity-50 cursor-not-allowed")}
          />
          <p className="text-xs text-muted-foreground">
            Agent pauses after this many consecutive losing trades
          </p>
        </div>

        {/* Live Agent Status */}
        {agentStatus.totalTrades > 0 && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Current Session Stats</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-secondary/30 rounded p-2">
                <p className="text-xs text-muted-foreground mb-1">Trades</p>
                <p className="font-mono text-sm font-bold">{agentStatus.totalTrades}</p>
              </div>
              <div className="bg-secondary/30 rounded p-2">
                <p className="text-xs text-muted-foreground mb-1">Success</p>
                <p className="font-mono text-sm font-bold text-success">
                  {agentStatus.successfulTrades || 0}
                </p>
              </div>
              <div className="bg-secondary/30 rounded p-2">
                <p className="text-xs text-muted-foreground mb-1">Skipped</p>
                <p className="font-mono text-sm font-bold text-warning">
                  {agentStatus.skippedTrades || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};