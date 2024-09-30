import { config } from "@/config";
import type { DisclaimerComponent } from '@rainbow-me/rainbowkit';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import '@rainbow-me/rainbowkit/styles.css';


const queryClient = new QueryClient()

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
    <Text>
        By connecting a wallet, you agree to PayFriends {' '}
        <Link href="/terms">Terms of Service</Link>.
    </Text>
);

export const Web3Context: React.FC<{ children: ReactNode }> = ({ children }) => {
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