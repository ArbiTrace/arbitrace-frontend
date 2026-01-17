import { motion } from 'framer-motion';
import { Shield, Target, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Strategy } from '@/types';

interface StrategyCardProps {
  strategy: Strategy;
  isSelected: boolean;
  onSelect: () => void;
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

export const StrategyCard = ({ strategy, isSelected, onSelect }: StrategyCardProps) => {
  const Icon = iconMap[strategy.riskLevel];
  const colorClass = colorMap[strategy.riskLevel];
  const glowClass = glowMap[strategy.riskLevel];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        'relative p-6 rounded-xl cursor-pointer transition-all duration-300',
        'bg-card/60 backdrop-blur-xl border',
        isSelected 
          ? `border-primary/50 ${glowClass}` 
          : 'border-border/50 hover:border-primary/30'
      )}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={cn('p-3 rounded-lg bg-secondary/50', colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">{strategy.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{strategy.riskLevel} Risk</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-secondary/30 rounded-lg p-2">
          <span className="text-muted-foreground">Min Profit</span>
          <p className="font-mono text-foreground">{(strategy.minProfitThreshold * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2">
          <span className="text-muted-foreground">Max Position</span>
          <p className="font-mono text-foreground">${strategy.maxPositionSize}</p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2">
          <span className="text-muted-foreground">Stop Loss</span>
          <p className="font-mono text-foreground">{(strategy.stopLossPercent * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-secondary/30 rounded-lg p-2">
          <span className="text-muted-foreground">Daily Loss Limit</span>
          <p className="font-mono text-foreground">${strategy.maxDailyLoss}</p>
        </div>
      </div>
    </motion.div>
  );
};
