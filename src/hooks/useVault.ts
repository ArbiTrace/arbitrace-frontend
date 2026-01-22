import {
    useReadContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
    useChainId,
    useSwitchChain
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { cronosTestnet } from 'wagmi/chains';
import { CONTRACTS, TOKENS } from '@/config/contracts';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Minimal ABI for StrategyVault
const VAULT_ABI = [
    {
        inputs: [
            { name: "token", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { name: "token", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { name: "user", type: "address" },
            { name: "token", type: "address" }
        ],
        name: "userBalances",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    }
] as const;

// Minimal ABI for ERC20 (Approve/Allowance)
const ERC20_ABI = [
    {
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" }
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function"
    }
] as const;

export function useVault() {
    const { address } = useAccount();
    const chainId = useChainId();
    const { switchChainAsync } = useSwitchChain();
    const [isPending, setIsPending] = useState(false);

    // Helper to ensure we're on the correct network
    const ensureCorrectNetwork = async () => {
        if (chainId !== cronosTestnet.id) {
            toast.info("Switching to Cronos Testnet...");
            try {
                await switchChainAsync({ chainId: cronosTestnet.id });
                toast.success("Switched to Cronos Testnet");
                return true;
            } catch (error: any) {
                toast.error("Failed to switch network. Please switch to Cronos Testnet manually.");
                throw error;
            }
        }
        return true;
    };

    // 1. Read Vault Balance (USDC)
    const {
        data: vaultBalance,
        refetch: refetchVaultBalance
    } = useReadContract({
        address: CONTRACTS.VAULT as `0x${string}`,
        abi: VAULT_ABI,
        functionName: 'userBalances',
        args: address ? [address, TOKENS.USDC as `0x${string}`] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // 2. Read Wallet Balance (USDC)
    const {
        data: walletBalance,
        refetch: refetchWalletBalance
    } = useReadContract({
        address: TOKENS.USDC as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // 3. Read Allowance
    const {
        data: allowance,
        refetch: refetchAllowance
    } = useReadContract({
        address: TOKENS.USDC as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACTS.VAULT as `0x${string}`] : undefined,
        query: {
            enabled: !!address,
        }
    });

    // 4. Write Functions
    const { writeContractAsync } = useWriteContract();

    const deposit = useCallback(async (amountStr: string) => {
        if (!address) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            setIsPending(true);

            // Ensure we're on the correct network
            await ensureCorrectNetwork();

            const amount = parseUnits(amountStr, 18); // USDC deployed with 18 decimals

            // Check Allowance
            const currentAllowance = allowance || 0n;

            if (currentAllowance < amount) {
                toast.info("Approving USDC...");
                const approveHash = await writeContractAsync({
                    address: TOKENS.USDC as `0x${string}`,
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [CONTRACTS.VAULT as `0x${string}`, amount],
                    chainId: cronosTestnet.id,
                });
                // We'd ideally wait for receipt here, but sticking to simple flow for now
                // In a real app, useWaitForTransactionReceipt on the approveHash
                toast.success("USDC Approved! Proceeding to Deposit...");
            }

            toast.info("Depositing to Vault...");
            const hash = await writeContractAsync({
                address: CONTRACTS.VAULT as `0x${string}`,
                abi: VAULT_ABI,
                functionName: 'deposit',
                args: [TOKENS.USDC as `0x${string}`, amount],
                chainId: cronosTestnet.id,
            });

            toast.success("Deposit Transaction Sent!");
            return hash;

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Deposit failed");
        } finally {
            setIsPending(false);
        }
    }, [address, allowance, writeContractAsync, chainId, switchChainAsync]);

    const withdraw = useCallback(async (amountStr: string) => {
        if (!address) {
            toast.error("Please connect your wallet");
            return;
        }

        try {
            setIsPending(true);

            // Ensure we're on the correct network
            await ensureCorrectNetwork();

            const amount = parseUnits(amountStr, 18); // USDC deployed with 18 decimals

            toast.info("Withdrawing from Vault...");
            const hash = await writeContractAsync({
                address: CONTRACTS.VAULT as `0x${string}`,
                abi: VAULT_ABI,
                functionName: 'withdraw',
                args: [TOKENS.USDC as `0x${string}`, amount],
                chainId: cronosTestnet.id,
            });

            toast.success("Withdrawal Transaction Sent!");
            return hash;

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Withdrawal failed");
        } finally {
            setIsPending(false);
        }
    }, [address, writeContractAsync, chainId, switchChainAsync]);

    const refreshBalances = useCallback(() => {
        refetchVaultBalance();
        refetchWalletBalance();
        refetchAllowance();
    }, [refetchVaultBalance, refetchWalletBalance, refetchAllowance]);

    return {
        vaultBalance: vaultBalance ? formatUnits(vaultBalance, 18) : "0",
        walletBalance: walletBalance ? formatUnits(walletBalance, 18) : "0",
        allowance: allowance ? formatUnits(allowance, 18) : "0",
        deposit,
        withdraw,
        refreshBalances,
        isPending
    };
}
