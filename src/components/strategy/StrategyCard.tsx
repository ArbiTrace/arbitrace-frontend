import { motion } from 'framer-motion';
import { Shield, Target, Zap, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Strategy } from '@/types';

interface StrategyCardProps {
  strategy: Strategy;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const iconMap = {
  conservative: Shield,
  moderate: Target,
  aggressive: Zap,
  custom: Target,
};

const colorMap = {
  conservative: 'text-success',
  moderate: 'text-primary',
  aggressive: 'text-destructive',
  custom: 'text-ai-purple',
};

const glowMap = {
  conservative: 'shadow-glow-profit',
  moderate: 'shadow-glow-electric',
  aggressive: 'shadow-glow-loss',
  custom: 'shadow-glow-electric',
};

const bgColorMap = {
  conservative: 'bg-success/10',
  moderate: 'bg-primary/10',
  aggressive: 'bg-destructive/10',
  custom: 'bg-primary/10',
};

export const StrategyCard = ({ strategy, isSelected, onSelect, disabled }: StrategyCardProps) => {
  const Icon = iconMap[strategy.riskLevel];
  const colorClass = colorMap[strategy.riskLevel];
  const glowClass = glowMap[strategy.riskLevel];
  const bgClass = bgColorMap[strategy.riskLevel];

  return (
    <motion.div
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onSelect}
      className={cn(
        'relative p-6 rounded-xl transition-all duration-300',
        'bg-card/60 backdrop-blur-xl border',
        disabled 
          ? 'cursor-not-allowed opacity-50' 
          : 'cursor-pointer',
        isSelected && !disabled
          ? `border-primary/50 ${glowClass}` 
          : 'border-border/50',
        !disabled && !isSelected && 'hover:border-primary/30'
      )}
    >
      {/* Selected Indicator */}
      {isSelected && !disabled && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg"
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}

      {/* Locked Indicator */}
      {disabled && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-secondary/80 flex items-center justify-center">
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('p-3 rounded-lg', bgClass, colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-foreground">{strategy.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-muted-foreground capitalize">{strategy.riskLevel} Risk</p>
            {isSelected && (
              <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {strategy.description}
      </p>

      {/* Parameters Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-secondary/30 rounded-lg p-2.5">
          <span className="text-xs text-muted-foreground block mb-1">Min Profit</span>
          <p className="font-mono text-foreground font-semibold">
            {(strategy.minProfitThreshold * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2.5">
          <span className="text-xs text-muted-foreground block mb-1">Max Position</span>
          <p className="font-mono text-foreground font-semibold">
            ${strategy.maxPositionSize.toLocaleString()}
          </p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2.5">
          <span className="text-xs text-muted-foreground block mb-1">Stop Loss</span>
          <p className="font-mono text-destructive font-semibold">
            {(strategy.stopLossPercent * 100).toFixed(0)}%
          </p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2.5">
          <span className="text-xs text-muted-foreground block mb-1">Daily Loss</span>
          <p className="font-mono text-foreground font-semibold">
            ${strategy.maxDailyLoss.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      {strategy.isActive && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <p className="text-xs text-muted-foreground">
            📊 Applied to {strategy.totalTrades || 0} trades
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};