import { parseEther } from 'viem'
import { task } from 'hardhat/config'
import { JALIL } from '../helpers/constants'

task('accounts', 'Prints the list of accounts', async (_, hre) => {
  const clients = await hre.viem.getWalletClients()

  for (const client of clients) {
    console.log(client.account.address)
  }
})

task('fund-account', 'Funds an account for testing')
  .addParam('address', 'The wallet address to fund', JALIL)
  .setAction(async ({ address }, hre) => {
    const [account] = await hre.viem.getWalletClients()

    await account.sendTransaction({ to: address, value: parseEther('1') })
  })

