// ============================================================================
// Deposit & Withdraw Modals
// ============================================================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  useVaultDeposit,
  useVaultWithdraw,
  useVaultBalance,
  useTokenBalance,
  useAllBalances,
} from '@/hooks/useContracts';
import { getTokens } from '@/contracts/config';
import { formatCurrency } from '@/utils/formatters';

// ============================================================================
// Deposit Modal
// ============================================================================

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const tokens = getTokens();
  
  const { deposit, isPending, isSuccess, reset } = useVaultDeposit();
  const { balance: walletBalance, balanceFormatted } = useTokenBalance(tokens.USDC);
  const { refetchAll } = useAllBalances();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      reset();
    }
  }, [isOpen, reset]);

  // Auto-close on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose();
        refetchAll();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose, refetchAll]);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    try {
      await deposit(tokens.USDC, amount, 18);
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  const handleMaxClick = () => {
    setAmount(balanceFormatted);
  };

  const isAmountValid = amount && parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(balanceFormatted);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Deposit to Vault
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Balance Display */}
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-2xl font-mono font-bold">
              {formatCurrency(parseFloat(balanceFormatted))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">USDC in wallet</p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="deposit-amount">Amount to Deposit</Label>
            <div className="relative">
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending}
                className="pr-20 font-mono text-lg"
                step="0.01"
                min="0"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMaxClick}
                disabled={isPending}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
              >
                MAX
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter amount in USDC
            </p>
          </div>

          {/* Warning for low balance */}
          {parseFloat(amount) > parseFloat(balanceFormatted) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">
                Insufficient balance. You only have {balanceFormatted} USDC.
              </p>
            </motion.div>
          )}

          {/* Success Message */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 rounded-lg bg-success/10 border border-success/30 flex items-start gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-success font-medium">Deposit successful!</p>
                  <p className="text-xs text-success/70 mt-0.5">
                    Your funds are now in the vault.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeposit}
            disabled={!isAmountValid || isPending}
            className="flex-1 gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Deposit
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Withdraw Modal
// ============================================================================

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const tokens = getTokens();
  
  const { withdraw, isPending, isSuccess, reset } = useVaultWithdraw();
  const { balance: vaultBalance, balanceFormatted } = useVaultBalance(tokens.USDC);
  const { refetchAll } = useAllBalances();

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      reset();
    }
  }, [isOpen, reset]);

  // Auto-close on success
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onClose();
        refetchAll();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose, refetchAll]);

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    try {
      await withdraw(tokens.USDC, amount, );
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  const handleMaxClick = () => {
    setAmount(balanceFormatted);
  };

  const isAmountValid = amount && parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(balanceFormatted);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Withdraw from Vault
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Balance Display */}
          <div className="p-4 rounded-lg bg-secondary/30 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Vault Balance</p>
            <p className="text-2xl font-mono font-bold">
              {formatCurrency(parseFloat(balanceFormatted))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">USDC available</p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
            <div className="relative">
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending}
                className="pr-20 font-mono text-lg"
                step="0.01"
                min="0"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMaxClick}
                disabled={isPending}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7"
              >
                MAX
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter amount in USDC
            </p>
          </div>

          {/* Warning for insufficient balance */}
          {parseFloat(amount) > parseFloat(balanceFormatted) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-destructive">
                Insufficient vault balance. You only have {balanceFormatted} USDC.
              </p>
            </motion.div>
          )}

          {/* Info about owner restriction */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Note: Only the vault owner can withdraw funds. If you're not the owner, this transaction will fail.
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-3 rounded-lg bg-success/10 border border-success/30 flex items-start gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-success font-medium">Withdrawal successful!</p>
                  <p className="text-xs text-success/70 mt-0.5">
                    Funds have been sent to your wallet.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleWithdraw}
            disabled={!isAmountValid || isPending}
            className="flex-1 gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Withdraw
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}