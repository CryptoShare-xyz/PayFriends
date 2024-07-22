import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();
const dummyKey = '0x' + '0'.repeat(32 * 2)

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true
      }
    }
  },

  // This makes sure tests are ran locally
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      accounts: [`${process.env.PRIVATE_KEY || dummyKey}`],
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    },
  },
  paths: {
    artifacts: '../frontend/artifacts'
  }

};

export default config;
