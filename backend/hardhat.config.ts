import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import * as dotenv from 'dotenv';
import type { HardhatUserConfig } from "hardhat/config";

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
      accounts: [`${process.env.BASE_SEPOLIA_PRIVATE_KEY || dummyKey}`],
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    },

    base: {
      accounts: [`${process.env.BASE_PRIVATE_KEY || dummyKey}`],
      url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  sourcify: {
    enabled: true
  }
};

export default config;
