import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative z-10 container mx-auto px-4 py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto bg-linear-to-br from-primary/5 to-accent/5 border-glow"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
          Ready to Start Trading?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join the future of automated arbitrage trading on Cronos blockchain.
          Start earning passive income today.
        </p>
        <Link to="/dashboard">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric text-lg px-10 group"
          >
            Launch App
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}