'use client'

import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from "wagmi";

export function useWalletCheck() {
    const { isConnected, chainId } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { openChainModal } = useChainModal();
    const myChain = useChainId()

    return (callback: () => void) => {
        return (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault()

            if (!isConnected && openConnectModal) {
                openConnectModal();
                return;
            }
            if (chainId !== myChain && openChainModal) {
                openChainModal()
                return;
            }

            callback();
        }
    }
}