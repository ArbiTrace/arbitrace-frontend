import { useScroll, useTransform, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import {DashboardPreview} from "./DashboardPreview";
import { useAppKitAccount } from "@reown/appkit/react";

// ============================================================================
// Animation Variants
// ============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

export function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const { isConnected } = useAppKitAccount();

  return (
    <section className="relative z-10 container mx-auto px-4 pt-32 pb-24 lg:pt-40 lg:pb-32">
      <motion.div
        style={{ y, opacity }}
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="text-center max-w-5xl mx-auto"
      >
        {/* Live Badge */}
        <motion.div variants={fadeInUp} className="mb-8 inline-block">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm text-primary font-medium">
              Now live on Cronos Mainnet
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
        >
          AI-Powered
          <br />
          <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
            Arbitrage Trading
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Capture cross-exchange price inefficiencies between{" "}
          <span className="text-foreground font-medium">Crypto.com</span> and{" "}
          <span className="text-foreground font-medium">VVS Finance</span> with
          intelligent, automated trading powered by advanced AI.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {isConnected && (
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-electric text-base sm:text-lg px-8 group w-full sm:w-auto"
            >
              Start Trading
              <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          )}
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:border-primary/50 text-base sm:text-lg px-8 w-full sm:w-auto"
            asChild
          >
            <a
              href="https://docs.arbitrace.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Documentation
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Dashboard Preview */}
      <DashboardPreview />
    </section>
  );
}