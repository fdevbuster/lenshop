import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Wallet, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useWalletConnection } from '@/hooks/use-wallet-connection';

export default function WalletConnectionStatus({ className }: { className?: string }) {
  const { status, errorMessage, isConnected, address, disconnectWallet } = useWalletConnection();
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  // Handle connection status changes
  useEffect(() => {
    if (status === 'connected' && address) {
      setStatusMessage('Wallet connected successfully');
      setStatusType('success');
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    } else if (status === 'disconnected') {
      setStatusMessage('Wallet disconnected successfully');
      setStatusType('success');
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 3000);
      return () => clearTimeout(timer);
    } else if (status === 'error' && errorMessage) {
      setStatusMessage(`Error: ${errorMessage}`);
      setStatusType('error');
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [status, address, errorMessage]);

  const handleDisconnect = () => {
    disconnectWallet();
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      {showStatus && (
        <div className="absolute top-0 left-0 right-0 z-10 animate-fade-in-down">
          <Card className={cn(
            "p-3 mb-3 flex items-center gap-2",
            statusType === 'success' ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50" :
            "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50"
          )}>
            {statusType === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            )}
            <p className={cn(
              "text-sm",
              statusType === 'success' ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
            )}>
              {statusMessage}
            </p>
          </Card>
        </div>
      )}

      <Card className="p-3 border-2 border-green-500/20 bg-white/90 dark:bg-gray-800/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Wallet Connected</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDisconnect}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800/50 flex items-center gap-1 h-8"
          >
            <LogOut className="h-3 w-3" />
            <span>Disconnect</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}