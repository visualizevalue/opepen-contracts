import { parseEther } from 'viem'
import hre from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { JALIL, VV } from './../helpers/constants'
import OpepenMetadataLinkModule from '../ignition/modules/OpepenMetadataLink'
import TheOpepenArchiveModule from '../ignition/modules/TheOpepenArchive'
import packedTokenEditions from './../data/token-packed-editions.json'

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

  const indices = [...Array(200).keys()].map(k => BigInt(k))
  const packedEditions = packedTokenEditions.map(n => BigInt(n))

  await data.contract.write.batchSaveTokenEditions([ indices, packedEditions ], { account: VV })

  return data
}
