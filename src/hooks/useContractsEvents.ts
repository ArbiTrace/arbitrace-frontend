// ============================================================================
// ArbiTrace Contract Event Listeners
// ============================================================================

import { useEffect } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { formatUnits } from 'viem';
import toast from 'react-hot-toast';
import { getContracts } from '../contracts/config';
import { VAULT_ABI, ROUTER_ABI, X402_SETTLER_ABI } from '../contracts/abis';
import { useTradingStore } from '../stores';

// ============================================================================
// Vault Events
// ============================================================================

/**
 * Listen for Deposit events
 */
export function useVaultDepositEvents() {
  const contracts = getContracts();

  useWatchContractEvent({
    address: contracts.vault,
    abi: VAULT_ABI,
    eventName: 'Deposit',
    onLogs(logs) {
      logs.forEach((log) => {
        const { user, token, amount } = log.args;
        const formattedAmount = formatUnits(amount || 0n, 6);

        toast.success(`💰 Deposited ${formattedAmount} USDC to vault`, {
          icon: '✅',
          duration: 4000,
        });
      });
    },
  });
}

/**
 * Listen for Withdrawal events
 */
export function useVaultWithdrawalEvents() {
  const contracts = getContracts();

  useWatchContractEvent({
    address: contracts.vault,
    abi: VAULT_ABI,
    eventName: 'Withdrawal',
    onLogs(logs) {
      logs.forEach((log) => {
        const { user, token, amount } = log.args;
        const formattedAmount = formatUnits(amount || 0n, 6);

        toast.success(`💸 Withdrawn ${formattedAmount} USDC from vault`, {
          icon: '✅',
          duration: 4000,
        });
      });
    },
  });
}

// ============================================================================
// Router Events
// ============================================================================

/**
 * Listen for ArbitrageExecuted events
 */
export function useArbitrageExecutedEvents() {
  const contracts = getContracts();
  const addTrade = useTradingStore((state) => state.addTrade);

  useWatchContractEvent({
    address: contracts.router,
    abi: ROUTER_ABI,
    eventName: 'ArbitrageExecuted',
    onLogs(logs) {
      logs.forEach((log) => {
        const { tokenIn, tokenOut, amountIn, amountOut, profit } = log.args;
        
        const formattedAmountIn = formatUnits(amountIn || 0n, 6);
        const formattedAmountOut = formatUnits(amountOut || 0n, 18);
        const formattedProfit = formatUnits(profit || 0n, 6);

        // Add trade to store (matches your existing Trade type)
        addTrade?.({
          id: log.transactionHash || `trade-${Date.now()}`,
          timestamp: Date.now(),
          pair: 'CRO/USDC',
          type: 'arbitrage',
          amountIn: formattedAmountIn,
          amountInToken: 'USDC',
          amountOut: formattedAmountOut,
          amountOutToken: 'CRO',
          profit: formattedProfit,
          profitPercent: (parseFloat(formattedProfit) / parseFloat(formattedAmountIn)) * 100,
          status: 'success',
          txHash: log.transactionHash || '',
          aiConfidence: 0, // Will be updated by WebSocket if AI data available
          aiReasoning: '',
          executionTime: 0,
          slippage: 0,
          gasUsed: 0,
          gasCost: '0',
        });

        // Show profit notification
        const profitValue = parseFloat(formattedProfit);
        if (profitValue > 0) {
          toast.success(`🎯 Arbitrage profit: +$${formattedProfit}`, {
            icon: '💰',
            duration: 5000,
          });
        } else {
          toast(`⚡ Trade executed: ${formattedAmountIn} USDC → ${formattedAmountOut} CRO`, {
            icon: '🔄',
            duration: 4000,
          });
        }
      });
    },
  });
}

/**
 * Listen for FundsSettled events
 */
export function useFundsSettledEvents() {
  const contracts = getContracts();

  useWatchContractEvent({
    address: contracts.router,
    abi: ROUTER_ABI,
    eventName: 'FundsSettled',
    onLogs(logs) {
      logs.forEach((log) => {
        const { token, amount, recipient } = log.args;
        const formattedAmount = formatUnits(amount || 0n, 6);

        toast.success(`🚚 Funds settled: ${formattedAmount} USDC`, {
          icon: '✅',
          duration: 4000,
        });
      });
    },
  });
}

/**
 * Listen for SwapExecuted events
 */
export function useSwapExecutedEvents() {
  const contracts = getContracts();

  useWatchContractEvent({
    address: contracts.router,
    abi: ROUTER_ABI,
    eventName: 'SwapExecuted',
    onLogs(logs) {
      logs.forEach((log) => {
        const { dex, tokenIn, tokenOut, amountIn, amountOut } = log.args;
        
        const formattedAmountIn = formatUnits(amountIn || 0n, 6);
        const formattedAmountOut = formatUnits(amountOut || 0n, 18);

        console.log('🔄 Swap executed:', {
          dex,
          tokenIn,
          tokenOut,
          amountIn: formattedAmountIn,
          amountOut: formattedAmountOut,
        });

        // Optional: Show toast for large swaps
        if (parseFloat(formattedAmountIn) >= 1000) {
          toast(`🔄 Large swap: ${formattedAmountIn} USDC → ${formattedAmountOut} CRO`, {
            duration: 3000,
          });
        }
      });
    },
  });
}

// ============================================================================
// X402 Settler Events
// ============================================================================

/**
 * Listen for SettlementTriggered events
 */
export function useSettlementTriggeredEvents() {
  const contracts = getContracts();

  useWatchContractEvent({
    address: contracts.x402Settler,
    abi: X402_SETTLER_ABI,
    eventName: 'SettlementTriggered',
    onLogs(logs) {
      logs.forEach((log) => {
        const { nonce, recipient, token, amount } = log.args;
        const formattedAmount = formatUnits(amount || 0n, 6);

        toast.success(`⚡ x402 Settlement: ${formattedAmount} USDC`, {
          icon: '🤖',
          duration: 5000,
        });

        console.log('✅ Settlement triggered:', {
          nonce: nonce?.slice(0, 10) + '...',
          recipient: recipient?.slice(0, 10) + '...',
          amount: formattedAmount,
        });
      });
    },
  });
}

/**
 * Listen for AgentUpdated events
 */
export function useAgentUpdatedEvents() {
  const contracts = getContracts();

  useWatchContractEvent({
    address: contracts.x402Settler,
    abi: X402_SETTLER_ABI,
    eventName: 'AgentUpdated',
    onLogs(logs) {
      logs.forEach((log) => {
        const { previousAgent, newAgent } = log.args;

        toast(`🤖 AI Agent updated`, {
          icon: 'ℹ️',
          duration: 6000,
        });

        console.log('🔄 Agent updated:', {
          previousAgent: previousAgent?.slice(0, 10) + '...',
          newAgent: newAgent?.slice(0, 10) + '...',
        });
      });
    },
  });
}

// ============================================================================
// Combined Hook
// ============================================================================

/**
 * Hook to enable all contract event listeners
 */
export function useContractEvents() {
  // Vault events
  useVaultDepositEvents();
  useVaultWithdrawalEvents();

  // Router events
  useArbitrageExecutedEvents();
  useFundsSettledEvents();
  useSwapExecutedEvents();

  // Settler events
  useSettlementTriggeredEvents();
  useAgentUpdatedEvents();

  useEffect(() => {
    console.log('✅ Contract event listeners initialized');
    return () => {
      console.log('❌ Contract event listeners cleaned up');
    };
  }, []);
}