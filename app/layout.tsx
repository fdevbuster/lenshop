
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "../styles/leaflet-custom.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { ThirdwebProvider, WalletProvider } from "thirdweb/react"
import { IPFS } from "@/lib/ipfs"
import { LensProvider } from "@lens-protocol/react"
import { client } from "@/lib/lens/client"
import { WagmiProvider } from "wagmi"
import { WagmiWalletProvider } from "@/components/wallet-provider"
import SessionProvider from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lenshop - Descubre lugares con Web3",
  description: "Un Foursquare descentralizado con Lens Protocol, NFTs y gamificación",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <WalletProvider id="io.metamask">
            <WagmiWalletProvider>
              <SessionProvider>

              <IPFS>
              {/* <LensProvider client={client}> */}
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">{children}</main>
                <Navigation />
              </div>
              
              {/* </LensProvider> */}
                
              </IPFS>
            </SessionProvider>
          </WagmiWalletProvider>
        </WalletProvider>
         
          
        </ThemeProvider>
      </body>
    </html>
  )
}
