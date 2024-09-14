import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const GroupSplit = buildModule("GroupSplit", (m) => {
    const usdcAddress = m.getParameter("usdcAddress");
    const groupSplit = m.contract("GroupSplit", [usdcAddress], {});

    return { groupSplit };
});

export default GroupSplit