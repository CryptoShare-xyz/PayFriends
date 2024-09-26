import { ethers, upgrades } from "hardhat";

const PROXY_ADDRESS = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1"

async function deployV2() {
    const GroupSplitV2 = await ethers.getContractFactory("GroupSplitV2")
    const groupSplit = await upgrades.upgradeProxy(PROXY_ADDRESS, GroupSplitV2);
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
    await deployV2()
}

// Handle errors and run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });