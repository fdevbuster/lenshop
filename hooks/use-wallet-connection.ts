import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useSession } from '@/components/session-provider';

export type WalletConnectionStatus = 'connecting' | 'connected' | 'disconnecting' | 'disconnected' | 'error';

export function useWalletConnection() {
  const { connect, connectors, error: connectError, isPending } = useConnect();
  const { disconnect, error: disconnectError } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { account } = useSession();
  
  const [status, setStatus] = useState<WalletConnectionStatus>(
    isConnected ? 'connected' : 'disconnected'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update status based on connection state
  useEffect(() => {
    if (isPending) {
      setStatus('connecting');
      return;
    }
    
    if (isConnected && address) {
      setStatus('connected');
      setErrorMessage(null);
      return;
    }
    
    if (!isConnected && !isPending) {
      setStatus('disconnected');
    }
  }, [isConnected, address, isPending]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      setStatus('error');
      setErrorMessage(connectError.message || 'Failed to connect wallet');
    }
  }, [connectError]);

  // Handle disconnection errors
  useEffect(() => {
    if (disconnectError) {
      setStatus('error');
      setErrorMessage(disconnectError.message || 'Failed to disconnect wallet');
    }
  }, [disconnectError]);

  const connectWallet = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (connector) {
      setStatus('connecting');
      connect({ connector });
    } else {
      setStatus('error');
      setErrorMessage(`Connector ${connectorId} not found`);
    }
  };

  const disconnectWallet = () => {
    setStatus('disconnecting');
    disconnect();
  };

  const resetError = () => {
    setErrorMessage(null);
    setStatus(isConnected ? 'connected' : 'disconnected');
  };

  return {
    status,
    errorMessage,
    isConnected,
    address,
    account,
    connectors,
    connectWallet,
    disconnectWallet,
    resetError,
    isPending
  };
}