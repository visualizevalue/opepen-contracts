import { parseEther } from 'viem'
import hre from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import OpepenMetadataLinkModule from '../ignition/modules/OpepenMetadataLink'
import TheOpepenArchiveModule from '../ignition/modules/TheOpepenArchive'
import { prepareTokenEditionsData } from '../helpers/token-editions'
import { JALIL, VV } from './../helpers/constants'

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

export async function opepenArchiveFixture() {
  const [owner, signer1, signer2, signer3] = await hre.viem.getWalletClients()

  const publicClient = await hre.viem.getPublicClient()

  const testClient = await hre.viem.getTestClient()
  await testClient.impersonateAccount({ address: JALIL })
  await testClient.impersonateAccount({ address: VV })
  await owner.sendTransaction({ to: JALIL, value: parseEther('1') })
  await owner.sendTransaction({ to: VV, value: parseEther('1') })

  const { archive } = await hre.ignition.deploy(TheOpepenArchiveModule)

  const contract = await hre.viem.getContractAt('TheOpepenArchive', archive.address)

  await contract.write.updateManager([VV], { account: VV })

  return {
    contract,
    owner,
    signer1,
    signer2,
    signer3,
    publicClient,
  }
}

export async function opepenArchiveSavedEditionsFixture() {
  const data = await loadFixture(opepenArchiveFixture)

  await data.contract.write.batchSaveTokenEditions(prepareTokenEditionsData(), { account: VV })

  return data
}
