import { ethers, ignition, network } from "hardhat";
import GroupSplit from "../ignition/modules/GroupSplit";
import USDCMock from "../ignition/modules/USDCMock";

const USDC_CONTRACT_ADDRESS = "0x5dEaC602762362FE5f135FA5904351916053cF70" // Base sepolia  

async function deployDevUSDC() {
    const signers = await ethers.getSigners();
    const addresses = signers.map((signer) => signer.address);
    const amount = "1000"

    console.log("Deploying USDCMock...");
    const { usdcMock } = await ignition.deploy(USDCMock);
    await usdcMock.waitForDeployment();
    // await usdcMock.getAddress();

    const mintAmount = ethers.parseUnits(amount, 6);

    // Mint USDC to each address fetched from the current node
    console.log(`Minting all addresses with ${amount} USDC...`);
    for (const address of addresses) {
        const tx = await usdcMock.mint(address, mintAmount);
        await tx.wait(); // Wait for the transaction to be mined
    }

    const deployedAddress = await usdcMock.getAddress();
    console.log(`Deployed USDCMock to ${deployedAddress}`);
    return deployedAddress;
}

async function deployGroupSplitter(usdcAddress: string) {
    const { groupSplit } = await ignition.deploy(GroupSplit, { parameters: { GroupSplit: { usdcAddress } } });
    const deployedAddress = await groupSplit.getAddress();
    console.log(`Deployed GroupSplitter to ${deployedAddress}`);
    return deployedAddress;
}

async function main() {
    // Fetch signers from the current node
    switch (network.name) {
        case "localhost":
            const usdcAddress = await deployDevUSDC();
            await deployGroupSplitter(usdcAddress);
            break;
        case "base_sepolia":
            await deployGroupSplitter(USDC_CONTRACT_ADDRESS)
            break
        default:
            break;
    }
    return;

}

// Handle errors and run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


// import hre from "hardhat";
// import USDCMock from "../ignition/modules/USDCMock";


// async function main() {
//     const { usdcMock } = await hre.ignition.deploy(USDCMock);

//     await usdcMock.waitForDeployment()
//     console.log(`Apollo deployed to: ${await usdcMock.getAddress()}`);
// }

// main().catch(console.error);