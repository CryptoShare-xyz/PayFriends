import { Avatar, ConnectKitButton } from "connectkit";

export default function Wallet({ isMobile }: { isMobile: boolean }) {
    const size = isMobile ? 16 : 32;

    return (
        <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, truncatedAddress, ensName, chain, address }) => {
                return (
                    <button onClick={show} className="flex flex-row items-center justify-center gap-2 bg-[#F0F2F5] p-2 rounded-2xl">
                        {isConnected && <Avatar address={address} size={size} radius={100} />}
                        <span className="text-xs md:text-base font-semibold">{isConnected ? truncatedAddress : "Connect Wallet"}</span>
                    </button>
                );
            }}
        </ConnectKitButton.Custom >
    );
};