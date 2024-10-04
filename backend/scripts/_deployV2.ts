import { ethers, upgrades } from "hardhat";

const PROXY_ADDRESS = "0x2ebcfE92bf4935172581be5148c160FEB47f7B76"

async function deployV2() {
    const GroupSplit = await ethers.getContractFactory("GroupSplit")
    const groupSplit = await upgrades.upgradeProxy(PROXY_ADDRESS, GroupSplit);
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