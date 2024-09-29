import { ConnectButton } from '@rainbow-me/rainbowkit';

const Wallet = () => {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected =
                    ready &&
                    account &&
                    chain;
                return (
                    <div
                        {...(!ready && {
                            'aria-hidden': true,
                            'style': {
                                opacity: 0,
                                pointerEvents: 'none',
                                userSelect: 'none',
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <button onClick={openConnectModal} className="flex flex-row items-center justify-center gap-2 bg-[#F0F2F5] p-2 rounded-2xl" type="button">
                                        <span className="text-xs md:text-base font-semibold">Connect Wallet</span>
                                    </button>
                                );
                            }
                            if (chain.unsupported) {
                                return (
                                    <button onClick={openChainModal} className="flex flex-row items-center justify-center gap-2 bg-red-600 text-white p-2 rounded-2xl" type="button">
                                        <span className="text-xs md:text-base font-semibold">Wrong network</span>
                                    </button>
                                );
                            }
                            return (
                                <button onClick={openAccountModal} type="button" className="flex flex-row items-center justify-center gap-2 bg-[#F0F2F5] p-2 rounded-2xl">
                                    <span className="text-xs md:text-base font-semibold">{account.displayName}</span>
                                </button>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom >
    );
};

export default Wallet;