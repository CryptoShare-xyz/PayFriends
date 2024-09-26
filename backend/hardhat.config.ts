import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();
const dummyKey = '0x' + '0'.repeat(32 * 2)

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true
      }
    }
  },

  typechain: {
    outDir: "../frontend/typechain-types", // Specify the output directory for generated types
    target: "web3-v1", // Generate types for Ethers.js v5
  },

  // This makes sure tests are ran locally
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // mining: {
      //   auto: false,
      //   interval: 1000
      // }
    },

    base_sepolia: {
      accounts: [`${process.env.PRIVATE_KEY || dummyKey}`],
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    },
  },
  paths: {
    artifacts: '../frontend/artifacts'
  }

};

export default config;
