import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const GroupSplitModule = buildModule("GroupSplitModule", (m) => {
    const group_split = m.contract("GroupSplit", [], {});

    return { group_split };
});

export default GroupSplitModule