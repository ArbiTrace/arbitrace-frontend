import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  TrendingUp,
  Shield,
  Cpu,
  ArrowRight,
  BarChart3,
  Clock,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Trading",
    description:
      "Advanced machine learning algorithms analyze market conditions in real-time to identify profitable arbitrage opportunities.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Execution",
    description:
      "Sub-second trade execution ensures you capture spreads before they disappear across CEX and DEX platforms.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Configurable stop-loss, position limits, and exposure controls protect your capital automatically.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description:
      "Comprehensive performance metrics, trade distribution analysis, and hourly heatmaps to optimize your strategy.",
  },
];

const stats = [
  { value: "76.3%", label: "Win Rate" },
  { value: "$2.8M+", label: "Volume Traded" },
  { value: "<2s", label: "Avg Execution" },
  { value: "24/7", label: "Uptime" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ai-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">ArbiTrace</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#stats"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Performance
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric">
                Launch App
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm text-primary font-medium">
              Now live on Cronos Mainnet
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            AI-Powered
            <span className="block bg-gradient-to-r from-primary via-primary to-ai-purple bg-clip-text text-transparent">
              Arbitrage Trading
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Capture cross-exchange price inefficiencies between Crypto.com and
            VVS Finance with intelligent, automated trading powered by advanced
            AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric text-lg px-8"
              >
                Start Trading
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:border-primary/50 text-lg px-8"
            >
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="glass-card rounded-2xl p-1 max-w-5xl mx-auto shadow-glow-electric">
            <div className="bg-card rounded-xl p-6 space-y-4">
              {/* Simulated dashboard preview */}
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
                <div className="text-sm text-muted-foreground">
                  ArbiTrace Dashboard
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-success">● Live</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Portfolio Value
                  </p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    $12,450.00
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">24h P&L</p>
                  <p className="font-mono text-xl font-bold text-success">
                    +$234.50
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                  <p className="font-mono text-xl font-bold text-foreground">
                    76.3%
                  </p>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Active Trades
                  </p>
                  <p className="font-mono text-xl font-bold text-primary">3</p>
                </div>
              </div>
              <div className="h-32 bg-secondary/20 rounded-lg flex items-center justify-center">
                <div className="w-full h-full p-4">
                  <svg className="w-full h-full" viewBox="0 0 400 80">
                    <defs>
                      <linearGradient
                        id="heroGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,60 Q50,55 100,45 T200,35 T300,25 T400,20"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,60 Q50,55 100,45 T200,35 T300,25 T400,20 L400,80 L0,80 Z"
                      fill="url(#heroGradient)"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="relative z-10 border-y border-border/50 bg-card/30 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 container mx-auto px-4 py-24"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to maximize arbitrage profits with minimal
            effort
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="relative z-10 container mx-auto px-4 py-24"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start earning in three simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: Wallet,
              step: "01",
              title: "Connect Wallet",
              desc: "Link your MetaMask or WalletConnect to get started",
            },
            {
              icon: TrendingUp,
              step: "02",
              title: "Configure Strategy",
              desc: "Set your risk parameters and profit thresholds",
            },
            {
              icon: Clock,
              step: "03",
              title: "Earn 24/7",
              desc: "AI monitors markets and executes trades automatically",
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-ai-purple/20 flex items-center justify-center mb-6">
                <item.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {item.step}
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-12 text-center max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-ai-purple/5"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join the future of automated arbitrage trading on Cronos blockchain.
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric text-lg px-10"
            >
              Launch App
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-ai-purple flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">ArbiTrace</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 ArbiTrace. Built on Cronos Blockchain.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
