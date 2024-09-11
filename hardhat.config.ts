import * as dotenv from 'dotenv'
import { zeroAddress } from 'viem'
import type { HardhatUserConfig } from 'hardhat/config'
import type { HardhatNetworkUserConfig } from 'hardhat/types'
import '@nomicfoundation/hardhat-toolbox-viem'
import '@nomicfoundation/hardhat-ledger'
import 'hardhat-chai-matchers-viem'
import 'hardhat-contract-sizer'

import './tasks/accounts'
import './tasks/chain'
import './tasks/export-abis'
import './tasks/archive'

dotenv.config()

const LEDGER_ACCOUNTS: string[] = process.env.LEDGER_ACCOUNT ? [process.env.LEDGER_ACCOUNT] : []
const ACCOUNT_PRVKEYS: string[] = process.env.PRIVATE_KEY    ? [process.env.PRIVATE_KEY   ] : []
const DEPLOY_AUTH: string = process.env.DEPLOY_AUTH || zeroAddress
const REDEPLOY_PROTECTION: string = process.env.REDEPLOY_PROTECTION === 'true' ? `01` : `00`
const ENTROPY: string = process.env.ENTROPY || `0000000000000000000009`
const SALT: string = `${DEPLOY_AUTH}${REDEPLOY_PROTECTION}${ENTROPY}`

const HARDHAT_NETWORK_CONFIG: HardhatNetworkUserConfig = {
  chainId: 1337,
  ledgerAccounts: LEDGER_ACCOUNTS,
  forking: {
    url: process.env.MAINNET_URL || '',
    blockNumber: 20726723
  },
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1_000,
      },
    },
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET_URL || "",
      accounts: ACCOUNT_PRVKEYS,
      ledgerAccounts: LEDGER_ACCOUNTS,
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: ACCOUNT_PRVKEYS,
      ledgerAccounts: LEDGER_ACCOUNTS,
    },
    holesky: {
      url: process.env.HOLESKY_URL || "",
      accounts: ACCOUNT_PRVKEYS,
      ledgerAccounts: LEDGER_ACCOUNTS,
    },
    localhost: {
      ...HARDHAT_NETWORK_CONFIG,
    },
    hardhat: HARDHAT_NETWORK_CONFIG,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    currency: 'USD',
    gasPrice: 10,
  },
  contractSizer: {
    alphaSort: true,
  },
  ignition: {
    strategyConfig: {
      create2: {
        salt: SALT,
      },
    },
  },
  mocha: {
    timeout: 120_000_000,
  },
}

export default config

/**
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

*/
