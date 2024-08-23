import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import React, { ReactNode } from "react";
import { WagmiConfig, createConfig } from "wagmi";
import { hardhat, sepolia } from "wagmi/chains";

const isDevelopment = process.env.NODE_ENV === 'development';
const selectedChains = isDevelopment ? [hardhat] : [sepolia];

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
        <WagmiConfig config={config}>
            <ConnectKitProvider theme="auto" mode="light">
                {children}
            </ConnectKitProvider>
        </WagmiConfig>
    )
}