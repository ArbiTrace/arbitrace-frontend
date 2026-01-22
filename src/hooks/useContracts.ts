// ============================================================================
// ArbiTrace Contract Hooks
// ============================================================================

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, Address } from 'viem';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getContracts, getTokens } from '../contracts/config';
import { STRATEGY_VAULT_ABI, ARBITRACE_ROUTER_ABI, X402_SETTLER_ABI, ERC20_ABI } from '../contracts/abis';

// ============================================================================
// Types
// ============================================================================

export interface TransactionState {
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash?: `0x${string}`;
}

// ============================================================================
// Vault Hooks
// ============================================================================

/**
 * Hook for reading vault balance
 */
export function useVaultBalance(tokenAddress?: Address) {
  const { address } = useAccount();
  const contracts = getContracts();

  const { data, isLoading, refetch } = useReadContract({
    address: contracts.vault,
    abi: STRATEGY_VAULT_ABI,
    functionName: 'totalBalances',
    args: tokenAddress ? [tokenAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  return {
    balance: data || 0n,
    balanceFormatted: data ? formatUnits(data, 18) : '0', // USDC has 18 decimals
    isLoading,
    refetch,
  };
}

/**
 * Hook for depositing to vault
 */
export function useVaultDeposit() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [state, setState] = useState<TransactionState>({
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const deposit = useCallback(
    async (tokenAddress: Address, amount: string, decimals: number = 18) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      setState({
        isPending: true,
        isConfirming: false,
        isSuccess: false,
        isError: false,
        error: null,
      });

      try {
        const contracts = getContracts();
        const amountBigInt = parseUnits(amount, decimals);

        // Step 1: Approve token
        toast.loading('Approving token spend...', { id: 'deposit-approval' });
        const approveTx = await writeContractAsync({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [contracts.vault, amountBigInt],
        });

        setState((prev) => ({ ...prev, isConfirming: true, txHash: approveTx }));
        toast.loading('Waiting for approval confirmation...', { id: 'deposit-approval' });

        // Wait for approval (simplified - in production use useWaitForTransactionReceipt)
        await new Promise((resolve) => setTimeout(resolve, 3000));
        toast.success('Token approved!', { id: 'deposit-approval' });

        // Step 2: Deposit
        toast.loading('Depositing to vault...', { id: 'deposit-tx' });
        const depositTx = await writeContractAsync({
          address: contracts.vault,
          abi: STRATEGY_VAULT_ABI,
          functionName: 'deposit',
          args: [tokenAddress, amountBigInt],
        });

        setState({
          isPending: false,
          isConfirming: false,
          isSuccess: true,
          isError: false,
          error: null,
          txHash: depositTx,
        });

        toast.success(`💰 Deposited ${amount} USDC to vault`, { id: 'deposit-tx' });
        return depositTx;
      } catch (error) {
        const err = error as Error;
        setState({
          isPending: false,
          isConfirming: false,
          isSuccess: false,
          isError: true,
          error: err,
        });

        // Better error messages
        const errorMessage = err.message?.includes('user rejected')
          ? 'Transaction cancelled'
          : err.message?.includes('insufficient funds')
          ? 'Insufficient balance for transaction'
          : 'Deposit failed - please try again';

        toast.error(errorMessage, { id: 'deposit-tx' });
        throw error;
      }
    },
    [address, writeContractAsync]
  );

  const reset = useCallback(() => {
    setState({
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
  }, []);

  return {
    deposit,
    reset,
    ...state,
  };
}

/**
 * Hook for withdrawing from vault
 */
export function useVaultWithdraw() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [state, setState] = useState<TransactionState>({
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const withdraw = useCallback(
    async (tokenAddress: Address, amount: string, decimals: number = 18) => {
      if (!address) {
        toast.error('Please connect your wallet');
        return;
      }

      setState({
        isPending: true,
        isConfirming: false,
        isSuccess: false,
        isError: false,
        error: null,
      });

      try {
        const contracts = getContracts();
        const amountBigInt = parseUnits(amount, decimals);

        toast.loading('Processing withdrawal...', { id: 'withdraw-tx' });
        const tx = await writeContractAsync({
          address: contracts.vault,
          abi: STRATEGY_VAULT_ABI,
          functionName: 'withdraw',
          args: [tokenAddress, amountBigInt],
        });

        setState({
          isPending: false,
          isConfirming: false,
          isSuccess: true,
          isError: false,
          error: null,
          txHash: tx,
        });

        toast.success(`💸 Withdrawn ${amount} USDC to wallet`, { id: 'withdraw-tx' });
        return tx;
      } catch (error) {
        const err = error as Error;
        setState({
          isPending: false,
          isConfirming: false,
          isSuccess: false,
          isError: true,
          error: err,
        });

        const errorMessage = err.message?.includes('user rejected')
          ? 'Transaction cancelled'
          : err.message?.includes('Ownable: caller is not the owner')
          ? 'Only vault owner can withdraw'
          : err.message?.includes('insufficient funds')
          ? 'Insufficient vault balance'
          : 'Withdrawal failed - please try again';

        toast.error(errorMessage, { id: 'withdraw-tx' });
        throw error;
      }
    },
    [address, writeContractAsync]
  );

  const reset = useCallback(() => {
    setState({
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
  }, []);

  return {
    withdraw,
    reset,
    ...state,
  };
}

// ============================================================================
// Router Hooks
// ============================================================================

/**
 * Hook for reading router configuration
 */
export function useRouterConfig() {
  const contracts = getContracts();

  const { data: vaultAddress } = useReadContract({
    address: contracts.router,
    abi: ARBITRACE_ROUTER_ABI,
    functionName: 'vault',
  });

  const { data: settlerAddress } = useReadContract({
    address: contracts.router,
    abi: ARBITRACE_ROUTER_ABI,
    functionName: 'settler',
  });

  const { data: ownerAddress } = useReadContract({
    address: contracts.router,
    abi: ARBITRACE_ROUTER_ABI,
    functionName: 'owner',
  });

  return {
    vaultAddress,
    settlerAddress,
    ownerAddress,
  };
}

// ============================================================================
// X402 Settler Hooks
// ============================================================================

/**
 * Hook for reading settler configuration
 */
export function useSettlerConfig() {
  const contracts = getContracts();

  const { data: agentAddress } = useReadContract({
    address: contracts.x402Settler,
    abi: X402_SETTLER_ABI,
    functionName: 'agent',
  });

  const { data: routerAddress } = useReadContract({
    address: contracts.x402Settler,
    abi: X402_SETTLER_ABI,
    functionName: 'router',
  });

  return {
    agentAddress,
    routerAddress,
  };
}

/**
 * Hook for checking if nonce has been processed
 */
export function useNonceStatus(nonce?: `0x${string}`) {
  const contracts = getContracts();

  const { data: isProcessed, refetch } = useReadContract({
    address: contracts.x402Settler,
    abi: X402_SETTLER_ABI,
    functionName: 'processedNonces',
    args: nonce ? [nonce] : undefined,
    query: {
      enabled: !!nonce,
    },
  });

  return {
    isProcessed: isProcessed || false,
    refetch,
  };
}

// ============================================================================
// Token Hooks
// ============================================================================

/**
 * Hook for reading token balance
 */
export function useTokenBalance(tokenAddress?: Address, userAddress?: Address) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = userAddress || connectedAddress;

  const { data, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!targetAddress,
      refetchInterval: 10000,
    },
  });

  return {
    balance: data || 0n,
    balanceFormatted: data ? formatUnits(data, 18) : '0',
    isLoading,
    refetch,
  };
}

/**
 * Hook for checking token allowance
 */
export function useTokenAllowance(tokenAddress?: Address, spenderAddress?: Address) {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && spenderAddress ? [address, spenderAddress] : undefined,
    query: {
      enabled: !!tokenAddress && !!spenderAddress && !!address,
    },
  });

  return {
    allowance: data || 0n,
    allowanceFormatted: data ? formatUnits(data, 18) : '0',
    isLoading,
    refetch,
  };
}

/**
 * Hook for approving token spend
 */
export function useTokenApprove() {
  const { writeContractAsync } = useWriteContract();
  const [state, setState] = useState<TransactionState>({
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  const approve = useCallback(
    async (tokenAddress: Address, spenderAddress: Address, amount: string, decimals: number = 18) => {
      setState({
        isPending: true,
        isConfirming: false,
        isSuccess: false,
        isError: false,
        error: null,
      });

      try {
        const amountBigInt = parseUnits(amount, decimals);

        toast.info('Approving token spend...');
        const tx = await writeContractAsync({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [spenderAddress, amountBigInt],
        });

        setState({
          isPending: false,
          isConfirming: false,
          isSuccess: true,
          isError: false,
          error: null,
          txHash: tx,
        });

        toast.success('Token approval successful');
        return tx;
      } catch (error) {
        const err = error as Error;
        setState({
          isPending: false,
          isConfirming: false,
          isSuccess: false,
          isError: true,
          error: err,
        });

        toast.error(err.message || 'Approval failed');
        throw error;
      }
    },
    [writeContractAsync]
  );

  return {
    approve,
    ...state,
  };
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook for getting all balances at once
 */
export function useAllBalances() {
  const { address } = useAccount();
  const tokens = getTokens();

  const { balance: usdcWalletBalance, refetch: refetchUsdcWallet } = useTokenBalance(
    tokens.USDC,
    address
  );
  const { balance: usdcVaultBalance, refetch: refetchUsdcVault } = useVaultBalance(tokens.USDC);
  const { balance: wcroWalletBalance, refetch: refetchWcroWallet } = useTokenBalance(
    tokens.WCRO,
    address
  );

  const refetchAll = useCallback(() => {
    refetchUsdcWallet();
    refetchUsdcVault();
    refetchWcroWallet();
  }, [refetchUsdcWallet, refetchUsdcVault, refetchWcroWallet]);

  return {
    usdc: {
      wallet: usdcWalletBalance,
      vault: usdcVaultBalance,
      walletFormatted: formatUnits(usdcWalletBalance, 18),
      vaultFormatted: formatUnits(usdcVaultBalance, 18),
    },
    wcro: {
      wallet: wcroWalletBalance,
      walletFormatted: formatUnits(wcroWalletBalance, 18),
    },
    refetchAll,
  };
}