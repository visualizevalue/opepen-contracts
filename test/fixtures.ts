import { parseEther } from 'viem'
import hre from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import OpepenMetadataLinkModule from '../ignition/modules/OpepenMetadataLink'
import OpepenMetadataRendererModule from '../ignition/modules/OpepenMetadataRenderer'
import TheOpepenArchiveModule from '../ignition/modules/TheOpepenArchive'
import { prepareTokenEditionsData } from '../helpers/token-editions'
import { JALIL, VV } from './../helpers/constants'
import { prepareSetData } from '../helpers/set-data'
import { prepareTokenSetsAndEditionsInput } from '../helpers/token-sets'

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

  await contract.write.updateManager([owner.account.address], { account: VV })

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

  await data.contract.write.batchSaveTokenEditions(prepareTokenEditionsData())

  return data
}

export async function opepenArchiveSetPublishedFixture() {
  const data = await loadFixture(opepenArchiveSavedEditionsFixture)

  const setData = {
    name: '8x8',
    description: 'The Original Opepen',
    artist: 'Jack Butcher',
    editionOne: 'XVI',
    editionFour: 'XII',
    editionFive: 'IX',
    editionTen: 'V',
    editionTwenty: 'III',
    editionForty: 'I',
    imageCid: '',
    animationCid: '',
  }

  await data.contract.write.updateSetData([
    1n,
    prepareSetData(setData)
  ])

  const mockRenderer = await hre.viem.deployContract('Set1RendererMock');
  await data.contract.write.updateSetArtifactRenderer([ 1n, mockRenderer.address ])

  await data.contract.write.batchSaveTokenSets(prepareTokenSetsAndEditionsInput())

  return data
}

export async function opepenMetadataRendererFixture() {
  const data = await loadFixture(opepenArchiveSetPublishedFixture)

  const { renderer } = await hre.ignition.deploy(OpepenMetadataRendererModule, {
    parameters: {
      OpepenMetadataRenderer: {
        archive: data.contract.address,
      },
    },
  })

  return {
    ...data,
    renderer,
  }
}
