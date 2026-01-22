import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="mt-16 lg:mt-24 relative"
    >
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
      
      <div className="glass-card rounded-2xl p-1 max-w-6xl mx-auto shadow-glow-electric border-glow">
        <div className="bg-card rounded-xl overflow-hidden">
          {/* Browser Chrome */}
          <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-secondary/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            <div className="text-sm text-muted-foreground font-mono hidden sm:block">
              app.arbitrace.ai
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs text-success font-medium">Live</span>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Portfolio Value", value: "$12,450.00", color: "foreground" },
                { label: "24h P&L", value: "+$234.50", color: "success" },
                { label: "Win Rate", value: "76.3%", color: "foreground" },
                { label: "Active Trades", value: "3", color: "primary" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-secondary/30 rounded-lg p-3 sm:p-4 border border-border/50 hover-lift"
                >
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p
                    className={cn(
                      "font-mono text-lg sm:text-xl font-bold",
                      stat.color === "success" && "text-success",
                      stat.color === "primary" && "text-primary",
                      stat.color === "foreground" && "text-foreground"
                    )}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart Preview */}
            <div className="h-32 sm:h-40 bg-secondary/20 rounded-lg flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--color-primary))" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="hsl(var(--color-primary))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 Q50,75 100,65 T200,55 T300,45 T400,35 T500,30 T600,25"
                  fill="none"
                  stroke="hsl(var(--color-primary))"
                  strokeWidth="2"
                />
                <path
                  d="M0,80 Q50,75 100,65 T200,55 T300,45 T400,35 T500,30 T600,25 L600,120 L0,120 Z"
                  fill="url(#heroGradient)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}