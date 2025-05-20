
import type React from "react";

// This component is now a simple pass-through. 
// All Wagmi, QueryClient, and ConnectKit provider setup is handled by Web3Provider.
export function WagmiWalletProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
