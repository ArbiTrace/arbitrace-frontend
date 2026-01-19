import { motion } from "framer-motion";

export function StatsSection() {
  const STATS = [
    { value: "76.3%", label: "Win Rate", suffix: "" },
    { value: "$2.8", label: "Volume Traded", suffix: "M+" },
    { value: "<2", label: "Avg Execution", suffix: "s" },
    { value: "24/7", label: "Uptime", suffix: "" },
  ] as const;

  return (
    <section
      id="performance"
      className="relative z-10 border-y border-border/50 bg-card/30 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className="mb-3">
                <span className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary transition-all group-hover:scale-110 inline-block">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary/70 ml-1">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
