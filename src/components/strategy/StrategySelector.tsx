import { useStrategyStore } from '@/stores';
import { StrategyCard } from './StrategyCard';
import { motion } from 'framer-motion';

interface StrategySelectorProps {
  onStrategyChange?: () => void;
  disabled?: boolean;
}

export const StrategySelector = ({ onStrategyChange, disabled }: StrategySelectorProps) => {
  const { strategies, activeStrategy, setActiveStrategy } = useStrategyStore();

  const handleStrategySelect = (strategy: any) => {
    if (disabled) return;
    setActiveStrategy(strategy);
    onStrategyChange?.();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-1">
          Pre-Built Strategies
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a strategy template or customize your own risk parameters below
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: disabled ? 0.5 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isSelected={activeStrategy?.id === strategy.id}
            onSelect={() => handleStrategySelect(strategy)}
            disabled={disabled}
          />
        ))}
      </motion.div>

      {disabled && (
        <p className="text-xs text-warning text-center">
          Strategy selection is disabled while agent is active
        </p>
      )}
    </div>
  );
};