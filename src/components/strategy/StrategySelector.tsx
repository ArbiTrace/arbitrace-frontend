import { useStrategyStore } from '@/stores';
import { StrategyCard } from './StrategyCard';

export const StrategySelector = () => {
  const { strategies, activeStrategy, setActiveStrategy } = useStrategyStore();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-display font-semibold text-foreground mb-1">
          Pre-Built Strategies
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a strategy template or customize your own risk parameters
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {strategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            isSelected={activeStrategy?.id === strategy.id}
            onSelect={() => setActiveStrategy(strategy)}
          />
        ))}
      </div>
    </div>
  );
};
