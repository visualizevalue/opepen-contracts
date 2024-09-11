import { parseEther } from 'viem'
import hre from 'hardhat'
import { JALIL, VV } from './../helpers/constants'
import OpepenMetadataLinkModule from '../ignition/modules/OpepenMetadataLink'

export async function opepenMetadataLinkFixture() {
  const [owner, signer1, signer2, signer3] = await hre.viem.getWalletClients()

  const publicClient = await hre.viem.getPublicClient()

  const testClient = await hre.viem.getTestClient()
  await testClient.impersonateAccount({ address: JALIL })
  await testClient.impersonateAccount({ address: VV })
  await owner.sendTransaction({ to: JALIL, value: parseEther('1') })
  await owner.sendTransaction({ to: VV, value: parseEther('1') })

  const { metadataLinkRenderer } = await hre.ignition.deploy(OpepenMetadataLinkModule)

  const contract = await hre.viem.getContractAt('OpepenMetadataLink', metadataLinkRenderer.address)

  return {
    contract,
    owner,
    signer1,
    signer2,
    signer3,
    publicClient,
  }
}
