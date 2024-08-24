import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from "react";
import { WagmiProvider, createConfig } from "wagmi";
import { hardhat, baseSepolia } from "wagmi/chains";

const isDevelopment = process.env.NODE_ENV === 'development';
const selectedChains = isDevelopment ? [hardhat] : [baseSepolia];

const queryClient = new QueryClient()

const config = createConfig(
    getDefaultConfig({
        chains: selectedChains,
        alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
        appName: "CryptoShare",
    })
);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
            <ConnectKitProvider theme="auto" mode="light">
                {children}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}