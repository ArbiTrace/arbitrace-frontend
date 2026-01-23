import { Zap } from "lucide-react";


export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/50 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div >
            <img src="/logo.png" alt="ArbiTrace Logo" className="w-16 h-16" />
          </div>
            <span className="font-display font-bold text-lg">ArbiTrace</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://docs.arbitrace.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </a>
            <a
              href="https://github.com/arbitrace"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://x.com/CodeBlocker_52"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ArbiTrace. Built on{" "}
            <span className="text-foreground font-medium">Cronos EVM</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
