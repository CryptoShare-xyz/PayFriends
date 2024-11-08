import { ethers, network, upgrades } from "hardhat";

const BASE_USDC_CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
const BASE_SEPOLIA_USDC_CONTRACT_ADDRESS = "0xB209bf575b13072195173619e95c1346497E98C3"
const KAKAROT_SEPOLIA_USDC_CONTRACT_ADDRESS = "0xdc10471e56D6a75FeBb540eB87865e586b03cA22"

async function deployDevUSDC() {
    const signers = await ethers.getSigners();
    const addresses = signers.map((signer) => signer.address);
    const amount = "1000"

    console.log("Deploying USDCMock...");
    const USDCMock = await ethers.getContractFactory("USDCMock");
    const usdcMock = await USDCMock.deploy();
    await usdcMock.waitForDeployment();

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
    const GroupSplit = await ethers.getContractFactory("GroupSplit")
    const groupSplit = await upgrades.deployProxy(GroupSplit, [usdcAddress]);
    const deployedAddress = await groupSplit.getAddress();
    console.log(`Proxy Address to ${deployedAddress}`);
    console.log(
        "Implementation Address:",
        await upgrades.erc1967.getImplementationAddress(deployedAddress)
    );
    console.log(
        "Admin Address:",
        await upgrades.erc1967.getAdminAddress(deployedAddress)
    );
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
            await deployGroupSplitter(BASE_SEPOLIA_USDC_CONTRACT_ADDRESS)
            break
        case "base":
            await deployGroupSplitter(BASE_USDC_CONTRACT_ADDRESS)
            break
        case "kakarot_sepolia":
            await deployGroupSplitter(KAKAROT_SEPOLIA_USDC_CONTRACT_ADDRESS)
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