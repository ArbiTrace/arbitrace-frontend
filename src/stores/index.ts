import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Trade,
  Opportunity,
  Portfolio,
  AgentStatus,
  PerformanceMetrics,
  Strategy,
  TradeFilters,
  NotificationSettings,
  DisplaySettings,
  GasPrice,
  SkippedTrade,
  AIInsights,
  AIDecision,
  BacktestResult,
} from "@/types";
import {
  generateMockTrades,
  generateMockOpportunities,
  generateMockPortfolio,
  generateMockAgentStatus,
  generateMockPerformanceMetrics,
  generateMockGasPrice,
  generateMockStrategies,
} from "@/services/mockData";

// ============================================
// Trading Store - Main trading data
// ============================================
interface TradingState {
  // Portfolio
  portfolio: Portfolio;
  setPortfolio: (portfolio: Portfolio) => void;
  updatePortfolio: (updates: Partial<Portfolio>) => void; // NEW

  // Agent
  agentStatus: AgentStatus;
  setAgentStatus: (
    status: AgentStatus | ((prev: AgentStatus) => AgentStatus),
  ) => void; // Updated
  toggleAgent: () => void;

  // Trades
  trades: Trade[];
  setTrades: (trades: Trade[]) => void;
  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void; // NEW

  // Opportunities
  opportunities: Opportunity[];
  setOpportunities: (opportunities: Opportunity[]) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void; // NEW
  removeOpportunity: (id: string) => void;

  // Skipped Trades (NEW)
  skippedTrades: SkippedTrade[];
  setSkippedTrades: (trades: SkippedTrade[]) => void;
  addSkippedTrade: (trade: SkippedTrade) => void;

  // AI Insights (NEW)
  aiInsights: AIInsights;
  setAIInsights: (
    insights: AIInsights | ((prev: AIInsights) => AIInsights),
  ) => void;
  updateAIDecision: (decision: AIDecision) => void;
  updateAIAnalysis: (analysis: string) => void;

  // Performance
  performanceMetrics: PerformanceMetrics;
  setPerformanceMetrics: (metrics: PerformanceMetrics) => void;

  // Gas
  gasPrice: GasPrice;
  setGasPrice: (price: GasPrice) => void;

  // Connection Status (NEW)
  isConnectedToAgent: boolean;
  setConnectedToAgent: (connected: boolean) => void;

  // Initialize with mock data
  initializeMockData: () => void;

  // Clear all data (NEW)
  clearAllData: () => void;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  portfolio: generateMockPortfolio(),
  agentStatus: generateMockAgentStatus(),
  trades: [],
  opportunities: [],
  skippedTrades: [], // NEW
  aiInsights: {
    // NEW
    lastDecision: null,
    lastPerformanceAnalysis: "",
    averageConfidence: 0,
  },
  performanceMetrics: generateMockPerformanceMetrics(),
  gasPrice: generateMockGasPrice(),
  isConnectedToAgent: false, // NEW

  setPortfolio: (portfolio) => set({ portfolio }),

  updatePortfolio: (updates) =>
    set((state) => ({
      portfolio: { ...state.portfolio, ...updates },
    })),

  setAgentStatus: (status) =>
    set((state) => ({
      agentStatus:
        typeof status === "function" ? status(state.agentStatus) : status,
    })),

  toggleAgent: () =>
    set((state) => ({
      agentStatus: {
        ...state.agentStatus,
        status: state.agentStatus.status === "active" ? "paused" : "active",
      },
    })),

  setTrades: (trades) => set({ trades }),

  addTrade: (trade) =>
    set((state) => {
      // Check if trade already exists
      const exists = state.trades.some((t) => t.id === trade.id);

      if (exists) {
        // Update existing trade instead of adding duplicate
        return {
          trades: state.trades.map((t) =>
            t.id === trade.id ? { ...t, ...trade } : t,
          ),
        };
      }

      // Add new trade
      return {
        trades: [trade, ...state.trades].slice(0, 100),
      };
    }),

  updateTrade: (id, updates) =>
    set((state) => {
      const exists = state.trades.some((t) => t.id === id);

      if (exists) {
        // Update existing trade
        return {
          trades: state.trades.map((t) =>
            t.id === id ? { ...t, ...updates } : t,
          ),
        };
      }

      // Trade doesn't exist - this shouldn't happen but handle it gracefully
      console.warn(`Trade ${id} not found for update`);
      return state;
    }),
    
  setOpportunities: (opportunities) => set({ opportunities }),

  addOpportunity: (opportunity) =>
    set((state) => {
      // Check if opportunity already exists
      const exists = state.opportunities.some((o) => o.id === opportunity.id);
      if (exists) {
        // Update existing opportunity
        return {
          opportunities: state.opportunities.map((o) =>
            o.id === opportunity.id ? { ...o, ...opportunity } : o,
          ),
        };
      }
      // Add new opportunity
      return {
        opportunities: [opportunity, ...state.opportunities].slice(0, 10),
      };
    }),

  updateOpportunity: (id, updates) =>
    set((state) => ({
      opportunities: state.opportunities.map((opp) =>
        opp.id === id ? { ...opp, ...updates } : opp,
      ),
    })),

  removeOpportunity: (id) =>
    set((state) => ({
      opportunities: state.opportunities.filter((o) => o.id !== id),
    })),

  // NEW: Skipped trades
  setSkippedTrades: (skippedTrades) => set({ skippedTrades }),

  addSkippedTrade: (trade) =>
    set((state) => ({
      skippedTrades: [trade, ...state.skippedTrades].slice(0, 50), // Keep last 50
    })),

  // NEW: AI insights
  setAIInsights: (insights) =>
    set((state) => ({
      aiInsights:
        typeof insights === "function" ? insights(state.aiInsights) : insights,
    })),

  updateAIDecision: (decision) =>
    set((state) => {
      // Calculate new average confidence
      const recentDecisions = state.opportunities
        .filter((o) => o.aiDecision?.confidence)
        .slice(0, 10);

      const avgConfidence =
        recentDecisions.length > 0
          ? recentDecisions.reduce(
              (sum, o) => sum + (o.aiDecision?.confidence || 0),
              0,
            ) / recentDecisions.length
          : decision.confidence;

      return {
        aiInsights: {
          ...state.aiInsights,
          lastDecision: decision,
          averageConfidence: avgConfidence,
        },
      };
    }),

  updateAIAnalysis: (analysis) =>
    set((state) => ({
      aiInsights: {
        ...state.aiInsights,
        lastPerformanceAnalysis: analysis,
      },
    })),

  setPerformanceMetrics: (performanceMetrics) => set({ performanceMetrics }),

  setGasPrice: (gasPrice) => set({ gasPrice }),

  setConnectedToAgent: (connected) => set({ isConnectedToAgent: connected }),

  initializeMockData: () => {
    set({
      trades: generateMockTrades(50),
      opportunities: generateMockOpportunities(5),
      skippedTrades: [],
      portfolio: generateMockPortfolio(),
      agentStatus: generateMockAgentStatus(),
      performanceMetrics: generateMockPerformanceMetrics(),
      gasPrice: generateMockGasPrice(),
      aiInsights: {
        lastDecision: null,
        lastPerformanceAnalysis: "",
        averageConfidence: 0,
      },
    });
  },

  clearAllData: () => {
    set({
      trades: [],
      opportunities: [],
      skippedTrades: [],
      aiInsights: {
        lastDecision: null,
        lastPerformanceAnalysis: "",
        averageConfidence: 0,
      },
    });
  },
}));

// ============================================
// Strategy Store
// ============================================
interface StrategyState {
  strategies: Strategy[];
  activeStrategy: Strategy | null;
  backtestResult: BacktestResult | null;
  setStrategies: (strategies: Strategy[]) => void;
  setActiveStrategy: (strategy: Strategy) => void;
  updateStrategy: (updates: Partial<Strategy>) => void;
  setBacktestResult: (result: BacktestResult | null) => void;
  initializeMockStrategies: () => void;
}

export const useStrategyStore = create<StrategyState>((set, get) => ({
  strategies: [],
  activeStrategy: null,
  backtestResult: null,

  setStrategies: (strategies) => set({ strategies }),

  setActiveStrategy: (strategy) =>
    set((state) => ({
      activeStrategy: { ...strategy },
      strategies: state.strategies.map((s) => ({
        ...s,
        isActive: s.id === strategy.id,
      })),
    })),

  updateStrategy: (updates) =>
    set((state) => {
      if (!state.activeStrategy) return state;
      const updated = { ...state.activeStrategy, ...updates };
      return {
        activeStrategy: updated,
        strategies: state.strategies.map((s) =>
          s.id === updated.id ? updated : s,
        ),
      };
    }),

  setBacktestResult: (result) => set({ backtestResult: result }),

  initializeMockStrategies: () => {
    const strategies = generateMockStrategies();
    set({
      strategies,
      activeStrategy: strategies.find((s) => s.isActive) || strategies[1],
    });
  },
}));

// ============================================
// UI Store - Modals, filters, UI state
// ============================================
interface UIState {
  // Modals
  activeModal: string | null;
  modalData: unknown;
  openModal: (name: string, data?: unknown) => void;
  closeModal: () => void;

  // Trade filters
  tradeFilters: TradeFilters;
  setTradeFilters: (filters: TradeFilters) => void;
  clearTradeFilters: () => void;

  // Selected time range for charts
  chartTimeRange: string;
  setChartTimeRange: (range: string) => void;

  // Mobile menu
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // NEW: View toggles
  showSkippedTrades: boolean;
  setShowSkippedTrades: (show: boolean) => void;

  showAIInsights: boolean;
  setShowAIInsights: (show: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  modalData: null,

  openModal: (name, data) => set({ activeModal: name, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  tradeFilters: {},
  setTradeFilters: (filters) => set({ tradeFilters: filters }),
  clearTradeFilters: () => set({ tradeFilters: {} }),

  chartTimeRange: "24H",
  setChartTimeRange: (range) => set({ chartTimeRange: range }),

  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

  // NEW
  showSkippedTrades: true,
  setShowSkippedTrades: (show) => set({ showSkippedTrades: show }),

  showAIInsights: true,
  setShowAIInsights: (show) => set({ showAIInsights: show }),
}));

// ============================================
// Settings Store - Persisted user preferences
// ============================================
interface SettingsState {
  notifications: NotificationSettings;
  display: DisplaySettings;
  setNotifications: (notifications: Partial<NotificationSettings>) => void;
  setDisplay: (display: Partial<DisplaySettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: {
        tradeExecution: true,
        riskWarnings: true,
        dailySummary: true,
        priceAlerts: false,
        aiDecisions: true, // NEW
        skippedTrades: false, // NEW
      },
      display: {
        theme: "dark",
        currency: "USD",
        chartType: "area",
        showAIInsights: true, // NEW
        showSkippedTrades: true, // NEW
      },

      setNotifications: (notifications) =>
        set((state) => ({
          notifications: { ...state.notifications, ...notifications },
        })),

      setDisplay: (display) =>
        set((state) => ({
          display: { ...state.display, ...display },
        })),
    }),
    {
      name: "arbitrace-settings",
    },
  ),
);

// ============================================
// Wallet Store
// ============================================
interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  setConnected: (
    connected: boolean,
    address?: string,
    chainId?: number,
  ) => void;
  setBalance: (balance: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: null,
  chainId: null,
  balance: null,

  setConnected: (connected, address, chainId) =>
    set({
      isConnected: connected,
      address: address || null,
      chainId: chainId || null,
    }),

  setBalance: (balance) => set({ balance }),

  disconnect: () =>
    set({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
    }),
}));

// ============================================
// Helper Hooks
// ============================================

/**
 * Get computed statistics from current state
 */
export function useComputedStats() {
  const { trades, opportunities, skippedTrades, agentStatus } =
    useTradingStore();

  const totalScans = agentStatus.totalTrades + (agentStatus.skippedTrades || 0);
  const executionRate =
    totalScans > 0 ? (agentStatus.totalTrades / totalScans) * 100 : 0;

  const aiApprovedOpportunities = opportunities.filter(
    (o) => o.aiDecision?.shouldExecute,
  ).length;

  const aiApprovalRate =
    opportunities.length > 0
      ? (aiApprovedOpportunities / opportunities.length) * 100
      : 0;

  const recentTrades = trades.slice(0, 10);
  const avgAIConfidence =
    recentTrades.length > 0
      ? recentTrades.reduce((sum, t) => sum + (t.aiConfidence || 0), 0) /
        recentTrades.length
      : 0;

  return {
    totalScans,
    executionRate,
    aiApprovalRate,
    avgAIConfidence,
    recentTrades,
  };
}

/**
 * Get filtered and sorted trades
 */
export function useFilteredTrades(filters?: TradeFilters) {
  const { trades } = useTradingStore();

  if (!filters || Object.keys(filters).length === 0) {
    return trades;
  }

  return trades.filter((trade) => {
    if (filters.status && trade.status !== filters.status) return false;
    if (filters.pair && !trade.pair.includes(filters.pair)) return false;
    if (filters.dateFrom && trade.timestamp < filters.dateFrom) return false;
    if (filters.dateTo && trade.timestamp > filters.dateTo) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        trade.pair.toLowerCase().includes(search) ||
        trade.txHash.toLowerCase().includes(search) ||
        trade.id.toLowerCase().includes(search)
      );
    }
    if (
      filters.minAIConfidence &&
      (trade.aiConfidence || 0) < filters.minAIConfidence
    ) {
      return false;
    }
    return true;
  });
}
