import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useTradingStore, useStrategyStore } from "@/stores";
import Landing from "./pages/Landing";
import Strategy from "./pages/Strategy";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/provider/ThemeProvider";
import { WalletProvider } from "./components/provider/WalletProvider";
import { useWebSocket } from '@/hooks/useWebSocket';
import Dashboard from "./pages/Dashboard";


const AppContent = () => {
  const initializeMockData = useTradingStore((s) => s.initializeMockData);
  const initializeMockStrategies = useStrategyStore(
    (s) => s.initializeMockStrategies,
  );
  
  // Initialize WebSocket connection
  useWebSocket();

  useEffect(() => {
    initializeMockData();
    initializeMockStrategies();
  }, [initializeMockData, initializeMockStrategies]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/strategy" element={<Strategy />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <ThemeProvider>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </WalletProvider>
  </ThemeProvider>
);

export default App;
