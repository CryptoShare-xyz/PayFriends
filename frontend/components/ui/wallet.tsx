import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

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
                                <div className='flex flex-row gap-4'>
                                    <button
                                        className='flex items-center hover:underline focus:underline'
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        {chain.hasIcon && (
                                            <div
                                                className={`rounded-full overflow-hidden mr-1 bg-[${chain.iconBackground}] w-[4vw] max-w-[24px]`}
                                            >
                                                {chain.iconUrl && (
                                                    <Image
                                                        alt={chain.name ?? 'Chain icon'}
                                                        src={chain.iconUrl}
                                                        width={48}
                                                        height={48}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <span className="text-xs md:text-base font-semibold">{chain.name}</span>
                                    </button>
                                    <button onClick={openAccountModal} type="button" className="flex flex-row items-center justify-center gap-2 bg-[#F0F2F5] p-2 rounded-2xl">
                                        <span className="text-xs md:text-base font-semibold">{account.displayName}</span>
                                    </button>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom >
    );
};

export default Wallet;