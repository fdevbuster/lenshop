import { Button } from './ui/button';
import { Card } from './ui/card';
import { Wallet, ExternalLink, LogOut, Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useWalletConnection } from '@/hooks/use-wallet-connection';

export default function WalletInfo({ className }: { className?: string }) {
  const { address, isConnected, disconnectWallet, account, status } = useWalletConnection();
  const [copied, setCopied] = useState(false);
  
  // Mock transaction history - in a real app, this would come from an API or blockchain query
  const transactions = [
    { id: '1', type: 'send', amount: '0.05 ETH', to: '0x1a2...3b4c', date: '2 hours ago', status: 'completed' },
    { id: '2', type: 'receive', amount: '0.1 ETH', from: '0x4d5...6e7f', date: 'Yesterday', status: 'completed' },
    { id: '3', type: 'contract', amount: '0.01 ETH', to: '0x7g8...9h0i', date: '3 days ago', status: 'completed' },
  ];

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Wallet Address Card */}
      <Card className="p-4 border-2 border-green-500/20 bg-white/90 dark:bg-gray-800/90">
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
                <button 
                  onClick={copyToClipboard}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Copy address"
                >
                  {copied ? 
                    <CheckCircle2 className="h-3 w-3 text-green-500" /> : 
                    <Copy className="h-3 w-3" />}
                </button>
                <a 
                  href={`https://etherscan.io/address/${address}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                  title="View on Etherscan"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-800/50 flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Disconnect</span>
          </Button>
        </div>
      </Card>

      {/* Transaction History */}
      <div>
        <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
        <Card className="divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    tx.type === 'send' ? "bg-red-100 dark:bg-red-900/20 text-red-500" :
                    tx.type === 'receive' ? "bg-green-100 dark:bg-green-900/20 text-green-500" :
                    "bg-blue-100 dark:bg-blue-900/20 text-blue-500"
                  )}>
                    {tx.type === 'send' ? '↑' : tx.type === 'receive' ? '↓' : '⚙️'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {tx.type === 'send' ? 'Sent' : tx.type === 'receive' ? 'Received' : 'Contract Interaction'}
                    </p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-medium",
                    tx.type === 'send' ? "text-red-500" : 
                    tx.type === 'receive' ? "text-green-500" : ""
                  )}>
                    {tx.type === 'send' ? '-' : tx.type === 'receive' ? '+' : ''}{tx.amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tx.type === 'send' ? `To: ${tx.to}` : 
                     tx.type === 'receive' ? `From: ${tx.from}` : 
                     `To: ${tx.to}`}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>No transactions yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}