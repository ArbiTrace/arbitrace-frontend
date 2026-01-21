import { FeatureCard, FEATURES } from "./FeatureCard";
import { motion } from "framer-motion";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative z-10 container mx-auto px-4 py-20 lg:py-32"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
          Powerful Features
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to maximize arbitrage profits with minimal effort
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <FeatureCard feature={feature} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
