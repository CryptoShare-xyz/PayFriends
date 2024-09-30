import { defineConfig } from '@wagmi/cli'
import { hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
    out: 'abi/generated.ts',
    contracts: [],
    plugins: [
        hardhat({
            project: '../backend',
        })
    ],
})