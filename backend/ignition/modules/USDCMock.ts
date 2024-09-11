import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const USDCMock = buildModule("USDCMock", (m) => {
    const usdcMock = m.contract("USDCMock", [], {});

    return { usdcMock };
});

export default USDCMock