import * as dotenv from "dotenv"

import "@nomicfoundation/hardhat-chai-matchers"
import "@nomiclabs/hardhat-etherscan"
import "@nomiclabs/hardhat-ethers"
import "@typechain/hardhat"
import "hardhat-contract-sizer"
import "hardhat-gas-reporter"
import "solidity-coverage"

import "./tasks/accounts"
import "./tasks/deploy"
import "./tasks/mine"

dotenv.config()

const HARDHAT_NETWORK_CONFIG = {
  chainId: 1337,
  forking: {
    url: process.env.MAINNET_URL || '',
    blockNumber: 16957600,
  },
}

const config = {
  solidity: "0.8.18",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      maxFeePerGas: 45_000_000_000, // 45 Gwei max on mainnet
      maxPriorityFeePerGas: 1_500_000_000, // 1.5 Gwei
      gasPrice: 45_000_000_000, // 45 Gwei max on mainnet
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    localhost: {
      ...HARDHAT_NETWORK_CONFIG,
    },
    hardhat: HARDHAT_NETWORK_CONFIG,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: "USD",
    // gasPrice: 20,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 120_000_000,
  },
}

export default config
