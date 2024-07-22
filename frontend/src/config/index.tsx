
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';

import { cookieStorage, createStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// Your WalletConnect Cloud project ID
export const projectId = '1bb6a37000416403a7683abf95cfa210'

const url =
    process.env.NODE_ENV === "production"
        ? `${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "localhost:3000";

// Create a metadata object
const metadata = {
    name: 'cryptoshare',
    description: 'AppKit Example',
    url, // origin must match your domain & subdomain,
    icons: []
}

// Create wagmiConfig
const chains = [sepolia] as const
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage
    }),
})
