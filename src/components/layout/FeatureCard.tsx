import { cn } from "@/lib/utils";
import { BarChart3, Cpu, Shield, Zap } from "lucide-react";


export const FEATURES = [
  {
    icon: Cpu,
    title: "AI-Powered Trading",
    description:
      "Advanced machine learning algorithms analyze market conditions in real-time to identify profitable arbitrage opportunities across exchanges.",
    gradient: "from-accent/20 to-primary/20",
  },
  {
    icon: Zap,
    title: "Lightning Fast Execution",
    description:
      "Sub-second trade execution with optimized gas pricing ensures you capture spreads before they disappear. Average execution time under 2 seconds.",
    gradient: "from-primary/20 to-warning/20",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Configurable stop-loss, position limits, and portfolio exposure controls protect your capital with automated circuit breakers.",
    gradient: "from-success/20 to-accent/20",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "Comprehensive performance metrics, Sharpe ratio calculations, trade distribution analysis, and hourly heatmaps to optimize your strategy.",
    gradient: "from-destructive/20 to-primary/20",
  },
] as const;

export function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  return (
    <div className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group h-full border-glow">
      <div
        className={cn(
          "w-14 h-14 rounded-xl bg-linear-to-br flex items-center justify-center mb-5 transition-transform group-hover:scale-110",
          feature.gradient
        )}
      >
        <feature.icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="font-display font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
        {feature.title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}