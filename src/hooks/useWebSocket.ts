import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useTradingStore } from '@/stores';
import toast from 'react-hot-toast';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  
  const {
    setAgentStatus,
    setOpportunities,
    addOpportunity,
    setTrades,
    addTrade,
    updateTrade,
    updatePortfolio,
    addSkippedTrade,     // NEW
    setAIInsights,        // NEW
  } = useTradingStore();

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      toast.success('Connected to agent');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Initial data
    socket.on('agent:status', setAgentStatus);
    socket.on('portfolio:updated', updatePortfolio);
    socket.on('opportunities:initial', setOpportunities);
    socket.on('trades:initial', setTrades);
    socket.on('ai:insights', setAIInsights); // NEW

    // Real-time updates
    socket.on('opportunity:detected', addOpportunity);
    
    socket.on('trade:executing', addTrade);
    
    socket.on('trade:completed', (trade) => {
      updateTrade(trade.id, trade);
      
      // Show different toast based on profit
      if (parseFloat(trade.profit) > 0) {
        toast.success(`✅ Trade Profit: $${trade.profit}`, {
          icon: '💰',
        });
      } else {
        toast.error(`❌ Trade Loss: $${trade.profit}`);
      }
    });
    
    socket.on('trade:skipped', (data) => { // NEW
      addSkippedTrade(data);
      toast(`🤖 AI skipped trade: ${data.reason}`, {
        icon: '⏭️',
        duration: 3000,
      });
    });
    
    socket.on('ai:decision', (decision) => { // NEW
      // Can show toast for important decisions
      if (decision.shouldExecute && decision.confidence >= 90) {
        toast.success(`🧠 High confidence trade: ${decision.confidence}%`);
      } else if (!decision.shouldExecute) {
        toast(`🤖 AI rejected: ${decision.reasoning.substring(0, 50)}...`, {
          duration: 2000,
        });
      }
    });
    
    socket.on('agent:status_changed', setAgentStatus);

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const startAgent = () => socketRef.current?.emit('agent:start');
  const stopAgent = () => socketRef.current?.emit('agent:stop');

  return { isConnected, startAgent, stopAgent };
}