import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenMetadataLinkFixture } from './fixtures'
import { JALIL, VV } from '../helpers/constants'
import hre from 'hardhat'
import { encodeFunctionData, parseAbi, toBytes, toHex } from 'viem'

describe('OpepenMetadataLink', function () {
  describe('contractURI', function () {
    it('should return the contract URI', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      expect(await contract.read.contractURI()).to.equal('https://metadata.opepen.art/opepen.json')
    })
  })

  describe('tokenURI', function () {
    it('should return the token URI', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      expect(await contract.read.tokenURI([1n])).to.equal('https://metadata.opepen.art/1/metadata.json')
    })
  })

  describe('setContractURI', function () {
    it('should set the contract URI', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      const newURI = 'https://example.com/new-contract'
      await contract.write.setContractURI([newURI], { account: VV })

      expect(await contract.read.contractURI()).to.equal(newURI)
    })

    it('should revert if not called by an admin', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      await expect(contract.write.setContractURI(['https://example.com/new-contract'], { account: JALIL }))
        .to.be.revertedWithCustomError(contract, 'Access_OnlyAdmin')
    })
  })

  describe('setBaseURI', function () {
    it('should set the base URI', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      const newURI = 'https://example.com/new-tokens'
      await contract.write.setBaseURI([ newURI ], { account: VV })

      expect(await contract.read.tokenURI([ 1n ])).to.equal(`${newURI}/1/metadata.json`)
    })

    it('should revert if not called by an admin', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      await expect(contract.write.setBaseURI([ 'https://example.com/new-tokens' ], { account: JALIL }))
        .to.be.revertedWithCustomError(contract, 'Access_OnlyAdmin')
    })
  })

  describe('Connect Renderer', function () {
    it('should revert if not called by the edition', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      await expect(contract.write.pingMetadataUpdate([ '0x123456789abcdef' ]))
        .to.be.revertedWith('Only the opepen edition can ping for an update.')
    })

    it('should emit Metadata Update events when pinging the renderer', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      const opepenContract = await hre.viem.getContractAt('ZoraEdition', '0x6339e5E072086621540D0362C4e3Cea0d643E114')

      // Switch the metadata renderer
      await opepenContract.write.setMetadataRenderer([ contract.address, toHex(0) ], { account: VV })
      expect(await opepenContract.read.metadataRenderer()).to.equal(contract.address)

      // Contract ABI
      const abi = [
        'function pingMetadataUpdate(string memory metadataHash) external'
      ];

      // Encode the function selector and arguments
      const metadataHash = '0x123456789abcdef'
      const calldata = encodeFunctionData({
        abi: parseAbi(abi),
        functionName: 'pingMetadataUpdate',
        args: [ metadataHash ],
      })

      await expect(opepenContract.write.callMetadataRenderer([ calldata ], { account: VV }))
        .to.emit(opepenContract, 'BatchMetadataUpdate').withArgs(1, 16001)
        .to.emit(contract, 'MetadataUpdate').withArgs(metadataHash)
    })

    it('link to the correct metadata urls', async function () {
      const { contract } = await loadFixture(opepenMetadataLinkFixture)

      const opepenContract = await hre.viem.getContractAt('ZoraEdition', '0x6339e5E072086621540D0362C4e3Cea0d643E114')

      // Switch the metadata renderer
      await opepenContract.write.setMetadataRenderer([ contract.address, toHex(0) ], { account: VV })

      expect(await opepenContract.read.contractURI()).to.equal('https://metadata.opepen.art/opepen.json')
      expect(await opepenContract.read.tokenURI([ 1n ])).to.equal('https://metadata.opepen.art/1/metadata.json')
    })
  })
})
