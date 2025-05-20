
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "../styles/leaflet-custom.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
// import { ThirdwebProvider, WalletProvider } from "thirdweb/react"
import { IPFS } from "@/lib/ipfs"
import { WagmiWalletProvider } from "@/components/wallet-provider";
import { Web3Provider } from "@/components/Web3Provider";
import { TopRightConnectButton } from "@/components/TopRightConnectButton";
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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} relative`}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

        
          {/* <WalletProvider id="io.metamask"> */}
          <WagmiWalletProvider>
            <Web3Provider>
              <TopRightConnectButton />
             
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
              
            </Web3Provider>
            </WagmiWalletProvider>
        {/* </WalletProvider> */}
         
          
       
     </ThemeProvider>

     </body>
    </html>
  )
}
