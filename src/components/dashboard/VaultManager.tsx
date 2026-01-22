import { useState } from 'react';
import { useVault } from '@/hooks/useVault';
import { useTradingStore } from '@/stores';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wallet, ArrowDownCircle, ArrowUpCircle, RefreshCw, Loader2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function VaultManager() {
    const {
        vaultBalance,
        walletBalance,
        deposit,
        withdraw,
        isPending,
        refreshBalances
    } = useVault();

    const { agentStatus } = useTradingStore();

    const [amount, setAmount] = useState('');

    const handleAction = async (action: 'deposit' | 'withdraw') => {
        if (!amount || parseFloat(amount) <= 0) return;

        if (action === 'deposit') {
            await deposit(amount);
        } else {
            await withdraw(amount);
        }
        setAmount('');
        // Ideally wait for tx then refresh, but for now:
        setTimeout(refreshBalances, 5000);
    };

    const setMax = (max: string) => {
        setAmount(max);
    };

    return (
        <Card className="h-full border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary" />
                        Vault Manager
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={refreshBalances} disabled={isPending}>
                        <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                <CardDescription>Manage your trading capital</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Balances - Updated to 3 columns */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">In Vault</p>
                        <p className="text-lg font-bold font-mono text-primary">{parseFloat(vaultBalance).toFixed(2)} <span className="text-xs text-muted-foreground">USDC</span></p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <p className="text-xs text-muted-foreground mb-1">In Wallet</p>
                        <p className="text-lg font-bold font-mono">{parseFloat(walletBalance).toFixed(2)} <span className="text-xs text-muted-foreground">USDC</span></p>
                    </div>
                    <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                        <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-success" />
                            <p className="text-xs text-success font-medium">Agent Profit</p>
                        </div>
                        <p className="text-lg font-bold font-mono text-success">
                            +{parseFloat(agentStatus.totalProfit || '0').toFixed(4)}
                            <span className="text-xs text-success/70 ml-1">USDC</span>
                        </p>
                    </div>
                </div>

                {/* Action Tabs */}
                <Tabs defaultValue="deposit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="deposit">Deposit</TabsTrigger>
                        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                    </TabsList>

                    {/* Deposit Content */}
                    <TabsContent value="deposit">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="deposit-amount">Amount (USDC)</Label>
                                <div className="relative">
                                    <Input
                                        id="deposit-amount"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        type="number"
                                        min="0"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 text-xs"
                                        onClick={() => setMax(walletBalance)}
                                    >
                                        Max
                                    </Button>
                                </div>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => handleAction('deposit')}
                                disabled={isPending || !amount}
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowDownCircle className="w-4 h-4 mr-2" />}
                                Deposit Funds
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Withdraw Content */}
                    <TabsContent value="withdraw">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="withdraw-amount">Amount (USDC)</Label>
                                <div className="relative">
                                    <Input
                                        id="withdraw-amount"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        type="number"
                                        min="0"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 text-xs"
                                        onClick={() => setMax(vaultBalance)}
                                    >
                                        Max
                                    </Button>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => handleAction('withdraw')}
                                disabled={isPending || !amount}
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowUpCircle className="w-4 h-4 mr-2" />}
                                Withdraw Funds
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
