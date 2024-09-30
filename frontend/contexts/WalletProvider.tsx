import type { DisclaimerComponent } from '@rainbow-me/rainbowkit';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React, { ReactNode } from "react";
import { http, WagmiProvider } from "wagmi";
// import { baseSepolia, hardhat } from "wagmi/chains";
import { base, hardhat } from "wagmi/chains";

import '@rainbow-me/rainbowkit/styles.css';

const isDevelopment = process.env.NODE_ENV === 'development';
const config = getDefaultConfig({
    // chains: isDevelopment ? [hardhat] : [baseSepolia],
    chains: isDevelopment ? [hardhat] : [base],
    transports: {
        [hardhat.id]: http(
            "http://127.0.0.1:8545",
        ),
        // [baseSepolia.id]: http(
        //     `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        // ),
        [base.id]: http(
            `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        ),
    },
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appName: "PayFriends",
    appIcon: "/og_image.jpg",
    appUrl: "https://payfriends.xyz",
    appDescription: "Share Expenses, Save on Fees - Powered by Crypto",
});

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
    <Text>
        By connecting a wallet, you agree to PayFriends {' '}
        <Link href="/terms">Terms of Service</Link>.
    </Text>
);



const queryClient = new QueryClient()


export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    modalSize='compact'
                    appInfo={{
                        disclaimer: Disclaimer,
                    }}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}