"use client"

import type React from "react"

import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { WagmiProvider, createConfig } from "wagmi"
import { Chain, lensTestnet, mainnet, polygon, lestnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const chains = [lensTestnet, polygon] as Chain[]

const config = createConfig(
  getDefaultConfig({
    appName: "LeMeS",
    chains: chains as any,
    
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  }),
)

// Create a client
const queryClient = new QueryClient()

export function WagmiWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <ConnectKitProvider theme="auto">{children}</ConnectKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
