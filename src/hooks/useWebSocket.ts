// ============================================================================
// Enhanced WebSocket Hook for ArbiTrace
// Integrates wallet connection with agent backend
// ============================================================================

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAccount } from 'wagmi';
import { useTradingStore } from '@/stores';
import toast from 'react-hot-toast';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { address, isConnected: isWalletConnected } = useAccount();
  
  const {
    setAgentStatus,
    setOpportunities,
    addOpportunity,
    updateOpportunity,
    setTrades,
    addTrade,
    updateTrade,
    updatePortfolio,
    addSkippedTrade,
    setAIInsights,
    updateAIDecision,
    updateAIAnalysis,
    setConnectedToAgent,
  } = useTradingStore();

  useEffect(() => {
    console.log(`🔌 Connecting to ArbiTrace Agent at ${WS_URL}...`);
    
    const socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to ArbiTrace Agent WebSocket');
      setIsConnected(true);
      setConnectedToAgent(true);
      toast.success('🤖 Connected to AI Agent', {
        icon: '✅',
        duration: 3000,
      });

      // Send wallet address to agent if wallet is connected
      if (isWalletConnected && address) {
        console.log(`👤 Sending wallet address to Agent: ${address}`);
        socket.emit('wallet:connected', { address });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from ArbiTrace Agent');
      setIsConnected(false);
      setConnectedToAgent(false);
      toast.error('Disconnected from AI Agent', {
        icon: '❌',
        duration: 3000,
      });
    });

    socket.on('connect_error', (err) => {
      console.error('⚠️ WebSocket connection error:', err);
      setIsConnected(false);
      setConnectedToAgent(false);
    });

    // ============================================
    // Initial Data Sync
    // ============================================
    socket.on('agent:status', (status) => {
      console.log('📊 Received agent status:', status);
      setAgentStatus(status);
    });

    socket.on('portfolio:updated', (portfolio) => {
      console.log('💰 Portfolio updated:', portfolio);
      updatePortfolio(portfolio);
    });

    socket.on('opportunities:initial', (opportunities) => {
      console.log('🎯 Initial opportunities:', opportunities.length);
      setOpportunities(opportunities);
    });

    socket.on('trades:initial', (trades) => {
      console.log('📜 Initial trades:', trades.length);
      setTrades(trades);
    });

    socket.on('ai:insights', (insights) => {
      console.log('🧠 AI insights:', insights);
      setAIInsights(insights);
    });

    // ============================================
    // Real-Time Updates
    // ============================================

    // Opportunity detected
    socket.on('opportunity:detected', (opportunity) => {
      console.log('🎯 New opportunity detected:', opportunity);
      addOpportunity(opportunity);

      // Show toast for high-value opportunities
      if (opportunity.netProfit > 5) {
        toast(`🎯 High-value opportunity: $${opportunity.netProfit.toFixed(2)}`, {
          icon: '💰',
          duration: 4000,
        });
      }
    });

    // Trade executing
    socket.on('trade:executing', (trade) => {
      console.log('⚡ Trade executing:', trade);
      addTrade(trade);
      
      toast.loading('⚡ Executing arbitrage trade...', {
        id: trade.id,
        duration: 10000,
      });
    });

    // Trade completed
    socket.on('trade:completed', (trade) => {
      console.log('✅ Trade completed:', trade);
      updateTrade(trade.id, trade);
      
      // Update opportunity status
      if (trade.opportunityId) {
        updateOpportunity(trade.opportunityId, { status: 'completed' });
      }

      // Show profit/loss toast
      const profit = parseFloat(trade.profit);
      if (profit > 0) {
        toast.success(`💰 Trade Profit: $${trade.profit}`, {
          id: trade.id,
          icon: '✅',
          duration: 5000,
        });
      } else if (profit < 0) {
        toast.error(`📉 Trade Loss: $${Math.abs(profit).toFixed(2)}`, {
          id: trade.id,
          duration: 5000,
        });
      } else {
        toast(`🔄 Trade completed (break-even)`, {
          id: trade.id,
          duration: 3000,
        });
      }
    });

    // Trade skipped by AI
    socket.on('trade:skipped', (data) => {
      console.log('⏭️ Trade skipped by AI:', data);
      addSkippedTrade(data);
      
      // Update opportunity status
      if (data.opportunityId) {
        updateOpportunity(data.opportunityId, { status: 'rejected' });
      }

      // Show notification (but don't be too noisy)
      if (data.confidence && data.confidence < 50) {
        toast(`🤖 Low confidence: ${data.reason}`, {
          icon: '⏭️',
          duration: 2000,
        });
      }
    });

    // AI decision
    socket.on('ai:decision', (decision) => {
      console.log('🧠 AI decision:', decision);
      updateAIDecision(decision);

      // Show toast for high-confidence decisions
      if (decision.shouldExecute && decision.confidence >= 90) {
        toast.success(`🧠 High confidence trade: ${decision.confidence}%`, {
          icon: '🎯',
          duration: 4000,
        });
      } else if (!decision.shouldExecute && decision.confidence < 30) {
        toast(`🤖 AI rejected (low confidence: ${decision.confidence}%)`, {
          icon: '⏭️',
          duration: 2000,
        });
      }
    });

    // Agent status changed
    socket.on('agent:status_changed', (status) => {
      console.log('🔄 Agent status changed:', status);
      setAgentStatus(status);

      // Show toast on status change
      if (status.status === 'active') {
        toast.success('🤖 AI Agent activated', {
          icon: '▶️',
        });
      } else if (status.status === 'paused') {
        toast('⏸️ AI Agent paused', {
          icon: '⏸️',
        });
      } else if (status.status === 'error') {
        toast.error('❌ AI Agent error', {
          icon: '❌',
        });
      }
    });

    // Risk warning
    socket.on('risk:warning', (warning) => {
      console.warn('⚠️ Risk warning:', warning);
      toast.error(`⚠️ ${warning.message}`, {
        icon: '🛑',
        duration: 6000,
      });
    });

    socketRef.current = socket;

    return () => {
      console.log('🔌 Disconnecting WebSocket...');
      socket.disconnect();
    };
  }, []);

  // ============================================
  // Sync wallet connection with agent
  // ============================================
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      if (isWalletConnected && address) {
        console.log(`👤 Wallet connected, notifying agent: ${address}`);
        socketRef.current.emit('wallet:connected', { address });
      } else {
        console.log('👤 Wallet disconnected, notifying agent');
        socketRef.current.emit('wallet:disconnected');
      }
    }
  }, [isWalletConnected, address]);

  // ============================================
  // Control Functions
  // ============================================
  const startAgent = () => {
    console.log('▶️ Starting agent...');
    socketRef.current?.emit('agent:start');
  };

  const stopAgent = () => {
    console.log('⏸️ Stopping agent...');
    socketRef.current?.emit('agent:stop');
  };

  return { 
    isConnected, 
    startAgent, 
    stopAgent,
    socket: socketRef.current,
  };
}