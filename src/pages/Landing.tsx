import {
  NavigationBar,
  HeroSection,
  StatsSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
  Footer,
} from "@/components/layout";

// ============================================================================
// Main Landing Component
// ============================================================================

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-success/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Grid Background */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />

      {/* Content */}
      <NavigationBar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}