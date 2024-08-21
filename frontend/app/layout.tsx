"use client";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Inter as FontSans } from "next/font/google";
import { WagmiConfig, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import "./globals.css";


const config = createConfig(
  getDefaultConfig({
    chains: [sepolia],
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
    appName: "CryptoShare",
  })
);

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <WagmiConfig config={config}>
        <ConnectKitProvider theme="auto" mode="light">
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased bg-slate-200",
              fontSans.variable
            )}
          >
            {children}
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
      <Toaster />
    </html>
  );
}
