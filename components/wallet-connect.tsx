import { Button } from './ui/button';
import { Card } from './ui/card';
import { Wallet, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { useSession } from './session-provider';

export default function WalletConnect({ className }: { className?: string }) {
  const { connect, connectors, error, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { account } = useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle errors
  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (connector) {
      connect({ connector });
    }
  };

  if (isConnected && address) {
    return (
      <Card className={cn("p-4 border-2 border-green-500/20 bg-white/90 dark:bg-gray-800/90", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Connected Wallet</h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <a 
                  href={`https://etherscan.io/address/${address}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => disconnect()}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800/50"
          >
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4 bg-white/90 dark:bg-gray-800/90 border-2 border-purple-500/20", className)}>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="h-20 w-20 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
          <Wallet className="h-10 w-10 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">Connect Wallet</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 text-center max-w-xs">
          Connect your wallet to explore places, check in, and earn rewards in your city
        </p>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-start gap-2 text-sm text-red-800 dark:text-red-300 max-w-xs">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        <div className="space-y-3 w-full max-w-xs">
          {/* WalletConnect specific button */}
          {connectors.map((connector) => {
            const isWalletConnect = connector.id === 'walletConnect';
            
            return (
              <Button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                disabled={!connector.ready || isPending}
                className={cn(
                  "w-full flex items-center justify-center gap-2 h-12 font-medium",
                  isWalletConnect ? "bg-[#3b99fc] hover:bg-[#2d7dd2] text-white" :
                  connector.name.toLowerCase().includes('metamask') ? 
                    "bg-[#F6851B] hover:bg-[#E2761B] text-white" : 
                    "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                )}
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>{connector.name}</span>
                )}
              </Button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help connecting your wallet?</p>
          <a href="https://ethereum.org/wallets/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Learn more about wallets
          </a>
        </div>
      </div>
    </Card>
  );
}