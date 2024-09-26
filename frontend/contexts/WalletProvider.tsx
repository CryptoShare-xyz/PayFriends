import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import React, { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
// import { baseSepolia, hardhat } from "wagmi/chains";
import { base, hardhat } from "wagmi/chains";

const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) {
    var config = createConfig(
        getDefaultConfig({
            chains: [hardhat],
            transports: {
                [hardhat.id]: http(
                    "http://127.0.0.1:8545",
                ),
            },
            walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
            appName: "PayFriendsDEV",
        })
    );
} else {
    var config = createConfig(
        getDefaultConfig({
            // chains: [baseSepolia],
            // transports: {
            //     [baseSepolia.id]: http(
            //         `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
            //     ),
            // },
            chains: [base],
            transports: {
                [base.id]: http(
                    `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
                ),
            },
            walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
            appName: "PayFriends",
        })
    );
}


const queryClient = new QueryClient()


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