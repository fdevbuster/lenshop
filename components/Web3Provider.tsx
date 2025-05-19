"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import React from "react";

// Fetch environment variables
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const alchemyIdPolygon = process.env.NEXT_PUBLIC_ALCHEMY_ID_POLYGON;
const alchemyIdMumbai = process.env.NEXT_PUBLIC_ALCHEMY_ID_MUMBAI;

if (!walletConnectProjectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined in .env.local");
}
if (!alchemyIdPolygon) {
  console.warn("NEXT_PUBLIC_ALCHEMY_ID_POLYGON is not defined in .env.local, public RPC will be used for Polygon Mainnet.");
}
const alchemyRpcLensTestnet = process.env.NEXT_PUBLIC_ALCHEMY_RPC_LENS_TESTNET;

if (!alchemyIdMumbai) {
  console.warn("NEXT_PUBLIC_ALCHEMY_ID_MUMBAI is not defined in .env.local, public RPC will be used for Polygon Mumbai.");
}
if (!alchemyRpcLensTestnet) {
  console.warn("NEXT_PUBLIC_ALCHEMY_RPC_LENS_TESTNET is not defined in .env.local. Lens Testnet may not be available or functional.");
}


export const lensTestnet = {
  id: 37111,
  name: 'Lens Testnet',
  nativeCurrency: { name: 'Test MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: alchemyRpcLensTestnet ? [alchemyRpcLensTestnet] : [''],
    },
    public: {
      http: alchemyRpcLensTestnet ? [alchemyRpcLensTestnet] : [''],
    },
  },
  testnet: true,
} as const;

const config = createConfig(
  getDefaultConfig({
    appName: "Lenshop",
    appDescription: "El Foursquare descentralizado para negocios y creadores locales.",
    appUrl: "http://localhost:3000", // Update with your actual app URL during deployment
    appIcon: "/logo.png", // Make sure you have a logo.png in your public folder
    walletConnectProjectId,
    chains: [polygon, polygonMumbai, lensTestnet],
    transports: {
      [polygon.id]: http(
        alchemyIdPolygon ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyIdPolygon}` : undefined
      ),
      [polygonMumbai.id]: http(
        alchemyIdMumbai ? `https://polygon-mumbai.g.alchemy.com/v2/${alchemyIdMumbai}` : undefined
      ),
      [lensTestnet.id]: http(alchemyRpcLensTestnet || undefined),
    },
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="auto" // Options: "auto", "light", "dark", "midnight"
          mode="auto"   // Options: "auto", "light", "dark"
          options={{
            // Optional: Customise ConnectKit further if needed
            // initialChainId: polygon.id, // Set a default chain
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
