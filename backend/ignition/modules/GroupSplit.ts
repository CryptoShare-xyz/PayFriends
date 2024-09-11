import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const USDC_CONTRACT_ADDRESS = "0x5dEaC602762362FE5f135FA5904351916053cF70" // Base sepolia  

const GroupSplitModule = buildModule("GroupSplitModule", (m) => {

    // deploy usdc to hardhat local in dev
    const isDev = process.env.NODE_ENV !== 'production'
    if (isDev) {
        m.contractAt("USDCMock", USDC_CONTRACT_ADDRESS)
    }

    const group_split = m.contract("GroupSplit", [USDC_CONTRACT_ADDRESS], {});

    return { group_split };
});

export default GroupSplitModule