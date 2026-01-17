import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  GasPrice
} from '@/types';
import {
  generateMockTrades,
  generateMockOpportunities,
  generateMockPortfolio,
  generateMockAgentStatus,
  generateMockPerformanceMetrics,
  generateMockGasPrice,
  generateMockStrategies,
} from '@/services/mockData';

// ============================================
// Trading Store - Main trading data
// ============================================
interface TradingState {
  // Portfolio
  portfolio: Portfolio;
  setPortfolio: (portfolio: Portfolio) => void;
  
  // Agent
  agentStatus: AgentStatus;
  setAgentStatus: (status: AgentStatus) => void;
  toggleAgent: () => void;
  
  // Trades
  trades: Trade[];
  setTrades: (trades: Trade[]) => void;
  addTrade: (trade: Trade) => void;
  
  // Opportunities
  opportunities: Opportunity[];
  setOpportunities: (opportunities: Opportunity[]) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  removeOpportunity: (id: string) => void;
  
  // Performance
  performanceMetrics: PerformanceMetrics;
  setPerformanceMetrics: (metrics: PerformanceMetrics) => void;
  
  // Gas
  gasPrice: GasPrice;
  setGasPrice: (price: GasPrice) => void;
  
  // Initialize with mock data
  initializeMockData: () => void;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  portfolio: generateMockPortfolio(),
  agentStatus: generateMockAgentStatus(),
  trades: [],
  opportunities: [],
  performanceMetrics: generateMockPerformanceMetrics(),
  gasPrice: generateMockGasPrice(),

  setPortfolio: (portfolio) => set({ portfolio }),
  
  setAgentStatus: (agentStatus) => set({ agentStatus }),
  
  toggleAgent: () => set((state) => ({
    agentStatus: {
      ...state.agentStatus,
      status: state.agentStatus.status === 'active' ? 'paused' : 'active',
    },
  })),
  
  setTrades: (trades) => set({ trades }),
  
  addTrade: (trade) => set((state) => ({
    trades: [trade, ...state.trades].slice(0, 100), // Keep last 100
  })),
  
  setOpportunities: (opportunities) => set({ opportunities }),
  
  addOpportunity: (opportunity) => set((state) => ({
    opportunities: [opportunity, ...state.opportunities].slice(0, 10),
  })),
  
  removeOpportunity: (id) => set((state) => ({
    opportunities: state.opportunities.filter((o) => o.id !== id),
  })),
  
  setPerformanceMetrics: (performanceMetrics) => set({ performanceMetrics }),
  
  setGasPrice: (gasPrice) => set({ gasPrice }),
  
  initializeMockData: () => {
    set({
      trades: generateMockTrades(50),
      opportunities: generateMockOpportunities(5),
      portfolio: generateMockPortfolio(),
      agentStatus: generateMockAgentStatus(),
      performanceMetrics: generateMockPerformanceMetrics(),
      gasPrice: generateMockGasPrice(),
    });
  },
}));

// ============================================
// Strategy Store
// ============================================
import { BacktestResult } from '@/types';

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
  
  setActiveStrategy: (strategy) => set((state) => ({
    activeStrategy: { ...strategy },
    strategies: state.strategies.map((s) => ({
      ...s,
      isActive: s.id === strategy.id,
    })),
  })),
  
  updateStrategy: (updates) => set((state) => {
    if (!state.activeStrategy) return state;
    const updated = { ...state.activeStrategy, ...updates };
    return {
      activeStrategy: updated,
      strategies: state.strategies.map((s) =>
        s.id === updated.id ? updated : s
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
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  modalData: null,
  
  openModal: (name, data) => set({ activeModal: name, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  
  tradeFilters: {},
  setTradeFilters: (filters) => set({ tradeFilters: filters }),
  clearTradeFilters: () => set({ tradeFilters: {} }),
  
  chartTimeRange: '24H',
  setChartTimeRange: (range) => set({ chartTimeRange: range }),
  
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
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
      },
      display: {
        theme: 'dark',
        currency: 'USD',
        chartType: 'area',
      },
      
      setNotifications: (notifications) => set((state) => ({
        notifications: { ...state.notifications, ...notifications },
      })),
      
      setDisplay: (display) => set((state) => ({
        display: { ...state.display, ...display },
      })),
    }),
    {
      name: 'arbitrace-settings',
    }
  )
);

// ============================================
// Wallet Store
// ============================================
interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  setConnected: (connected: boolean, address?: string, chainId?: number) => void;
  setBalance: (balance: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: null,
  chainId: null,
  balance: null,
  
  setConnected: (connected, address, chainId) => set({
    isConnected: connected,
    address: address || null,
    chainId: chainId || null,
  }),
  
  setBalance: (balance) => set({ balance }),
  
  disconnect: () => set({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
  }),
}));
