// ============================================================================
// ArbiTrace Contract Event Listeners
// ============================================================================

import { useEffect } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { formatUnits } from 'viem';
import { toast } from 'sonner';
import { getContracts } from '../contracts/config';
import { STRATEGY_VAULT_ABI, ARBITRACE_ROUTER_ABI, X402_SETTLER_ABI } from '../contracts/abis';
import { useTradingStore } from '../stores';

// ============================================================================
// Vault Events
// ============================================================================

/**
 * Listen for Deposit events
 */
export function useVaultDepositEvents() {
  const contracts = getContracts();
  const addNotification = useTradingStore((state) => state.addNotification);

  useWatchContractEvent({
    address: contracts.vault,
    abi: STRATEGY_VAULT_ABI,
    eventName: 'Deposit',
    onLogs(logs) {
      logs.forEach((log) => {
        const { user, amount } = log.args;
        const formattedAmount = formatUnits(amount || 0n, 18);

        toast.success(`Deposited ${formattedAmount} USDC to vault`, {
          description: `Transaction: ${log.transactionHash?.slice(0, 10)}...`,
        });

        addNotification?.({
          id: log.transactionHash || `deposit-${Date.now()}`,
          type: 'success',
          message: `Deposited ${formattedAmount} USDC`,
          timestamp: Date.now(),
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
  const addNotification = useTradingStore((state) => state.addNotification);

  useWatchContractEvent({
    address: contracts.vault,
    abi: STRATEGY_VAULT_ABI,
    eventName: 'Withdrawal',
    onLogs(logs) {
      logs.forEach((log) => {
        const { user, amount } = log.args;
        const formattedAmount = formatUnits(amount || 0n, 18);

        toast.success(`Withdrawn ${formattedAmount} USDC from vault`, {
          description: `Transaction: ${log.transactionHash?.slice(0, 10)}...`,
        });

        addNotification?.({
          id: log.transactionHash || `withdraw-${Date.now()}`,
          type: 'success',
          message: `Withdrawn ${formattedAmount} USDC`,
          timestamp: Date.now(),
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
    abi: ARBITRACE_ROUTER_ABI,
    eventName: 'ArbitrageExecuted',
    onLogs(logs) {
      logs.forEach((log) => {
        const { tokenIn, tokenOut, amountIn, amountOut, profit } = log.args;
        
        const formattedAmountIn = formatUnits(amountIn || 0n, 18);
        const formattedAmountOut = formatUnits(amountOut || 0n, 18);
        const formattedProfit = formatUnits(profit || 0n, 18);

        // Add trade to store
        addTrade?.({
          id: log.transactionHash || `trade-${Date.now()}`,
          timestamp: Date.now(),
          type: 'arbitrage',
          tokenIn: tokenIn || '0x0',
          tokenOut: tokenOut || '0x0',
          amountIn: formattedAmountIn,
          amountOut: formattedAmountOut,
          profit: formattedProfit,
          status: 'success',
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
        });

        toast.success(`Arbitrage executed: +${formattedProfit} USDC profit`, {
          description: `Traded ${formattedAmountIn} USDC → ${formattedAmountOut} WCRO`,
        });
      });
    },
  });
}

/**
 * Listen for FundsSettled events
 */
export function useFundsSettledEvents() {
  const contracts = getContracts();
  const addNotification = useTradingStore((state) => state.addNotification);

  useWatchContractEvent({
    address: contracts.router,
    abi: ARBITRACE_ROUTER_ABI,
    eventName: 'FundsSettled',
    onLogs(logs) {
      logs.forEach((log) => {
        const { token, amount, recipient } = log.args;
        const formattedAmount = formatUnits(amount || 0n, 18);

        toast.success(`Funds settled: ${formattedAmount} USDC`, {
          description: `Sent to ${recipient?.slice(0, 10)}...`,
        });

        addNotification?.({
          id: log.transactionHash || `settlement-${Date.now()}`,
          type: 'success',
          message: `Settled ${formattedAmount} USDC`,
          timestamp: Date.now(),
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
    abi: ARBITRACE_ROUTER_ABI,
    eventName: 'SwapExecuted',
    onLogs(logs) {
      logs.forEach((log) => {
        const { dex, tokenIn, tokenOut, amountIn, amountOut } = log.args;
        
        const formattedAmountIn = formatUnits(amountIn || 0n, 18);
        const formattedAmountOut = formatUnits(amountOut || 0n, 18);

        console.log('Swap executed:', {
          dex,
          tokenIn,
          tokenOut,
          amountIn: formattedAmountIn,
          amountOut: formattedAmountOut,
        });
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
  const addNotification = useTradingStore((state) => state.addNotification);

  useWatchContractEvent({
    address: contracts.x402Settler,
    abi: X402_SETTLER_ABI,
    eventName: 'SettlementTriggered',
    onLogs(logs) {
      logs.forEach((log) => {
        const { nonce, recipient, token, amount } = log.args;
        const formattedAmount = formatUnits(amount || 0n, 18);

        toast.success(`Settlement triggered: ${formattedAmount} USDC`, {
          description: `Nonce: ${nonce?.slice(0, 10)}...`,
        });

        addNotification?.({
          id: log.transactionHash || `settlement-trigger-${Date.now()}`,
          type: 'info',
          message: `Settlement triggered for ${formattedAmount} USDC`,
          timestamp: Date.now(),
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

        toast.info('AI Agent updated', {
          description: `New agent: ${newAgent?.slice(0, 10)}...`,
        });

        console.log('Agent updated:', {
          previousAgent,
          newAgent,
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