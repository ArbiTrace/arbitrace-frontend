import { Clock, TrendingUp, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  const HOW_IT_WORKS_STEPS = [
    {
      icon: Wallet,
      step: "01",
      title: "Connect Wallet",
      description:
        "Link your MetaMask, WalletConnect, or Coinbase Wallet to get started on Cronos",
      color: "primary",
    },
    {
      icon: TrendingUp,
      step: "02",
      title: "Configure Strategy",
      description:
        "Set your risk parameters, profit thresholds, and choose from Conservative, Balanced, or Aggressive presets",
      color: "accent",
    },
    {
      icon: Clock,
      step: "03",
      title: "Earn 24/7",
      description:
        "AI monitors markets continuously and executes profitable arbitrage trades automatically while you sleep",
      color: "success",
    },
  ] as const;
  return (
    <section
      id="how-it-works"
      className="relative z-10 container mx-auto px-4 py-20 lg:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
          How It Works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start earning in three simple steps
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
        {HOW_IT_WORKS_STEPS.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="text-center relative"
          >
            {/* Connecting Line (hidden on mobile) */}
            {index < HOW_IT_WORKS_STEPS.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-border to-transparent" />
            )}

            {/* Icon Circle */}
            <div className="relative mx-auto w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group hover:scale-110 transition-transform">
              <item.icon className="w-9 h-9 text-primary" />
              <span className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-glow-electric">
                {item.step}
              </span>
            </div>

            {/* Content */}
            <h3 className="font-display font-semibold text-xl mb-3">
              {item.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
