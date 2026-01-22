import { useEffect } from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import toast from 'react-hot-toast';

export function useWalletConnection() {
  const { address, isConnected, status } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const isCorrectNetwork = chainId === 338;

  // Show connection status toasts
  useEffect(() => {
    if (status === 'connected' && address) {
      toast.success('Wallet connected successfully');
    } else if (status === 'disconnected') {
      toast('Wallet disconnected', { icon: '👋' });
    }
  }, [status, address]);

  // Warn about wrong network
  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      toast.error('Please switch to Cronos network', {
        duration: 5000,
        id: 'wrong-network',
      });
    }
  }, [isConnected, isCorrectNetwork]);

  return {
    address,
    isConnected,
    chainId,
    isCorrectNetwork,
    status,
  };
}