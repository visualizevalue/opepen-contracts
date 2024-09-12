import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenArchiveFixture, opepenArchiveSavedEditionsFixture } from './fixtures'
import { prepareTokenSetsData, prepareTokenSetsDataForSet } from '../helpers/token-sets'
import { JALIL, VV } from '../helpers/constants'

describe('TheOpepenArchive', function () {
  describe('Token Editions', function () {
    it('should store the editions for each token', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      expect(await contract.read.getTokenEdition([1n])).to.equal(5)
      expect(await contract.read.getTokenEdition([2n])).to.equal(40)
      expect(await contract.read.getTokenEdition([3n])).to.equal(40)
      expect(await contract.read.getTokenEdition([4n])).to.equal(20)

      expect(await contract.read.getTokenEdition([79n])).to.equal(40)
      expect(await contract.read.getTokenEdition([80n])).to.equal(20)
      expect(await contract.read.getTokenEdition([81n])).to.equal(10)
      expect(await contract.read.getTokenEdition([82n])).to.equal(40)

      expect(await contract.read.getTokenEdition([1001n])).to.equal(1)

      expect(await contract.read.getTokenEdition([16000n])).to.equal(10)
    })
  })

  describe('Token Sets', function () {
    it('should allow storing the sets for tokens', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)

      await contract.write.batchSaveTokenSets(prepareTokenSetsData(), { account: VV })

      expect(await contract.read.getTokenSet([7n])).to.equal(30)
      expect(await contract.read.getTokenSet([20n])).to.equal(49)

      expect(await contract.read.getTokenSet([69n])).to.equal(0)
      expect(await contract.read.getTokenSet([70n])).to.equal(1)
      expect(await contract.read.getTokenSet([71n])).to.equal(7)

      expect(await contract.read.getTokenSet([151n])).to.equal(1)
      expect(await contract.read.getTokenSet([4036n])).to.equal(1)
      expect(await contract.read.getTokenSet([15446n])).to.equal(1)
    })

    it('should allow storing a single set for tokens', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)

      await contract.write.batchSaveTokenSets(prepareTokenSetsDataForSet(1), { account: VV })

      expect(await contract.read.getTokenSet([70n])).to.equal(1)

      expect(await contract.read.getTokenSet([151n])).to.equal(1)
      expect(await contract.read.getTokenSet([4036n])).to.equal(1)
      expect(await contract.read.getTokenSet([15446n])).to.equal(1)

      await contract.write.batchSaveTokenSets(prepareTokenSetsDataForSet(2), { account: VV })

      expect(await contract.read.getTokenSet([100n])).to.equal(2)
    })
  })

  describe('Default Metadata URI', function () {
    it('should allow setting the metadata URI', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await expect(contract.write.updateDefaultMetadataURI([ 'ipfs://opepen' ], { account: VV }))
        .not.to.be.reverted
    })

    it('should expose the default metadata URI', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await contract.write.updateDefaultMetadataURI([ 'ipfs://opepen' ], { account: VV })

      expect(await contract.read.defaultMetadataURI()).to.equal('ipfs://opepen')
    })

    it('should return the default metadata URI if no custom data is set', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await contract.write.updateDefaultMetadataURI([ 'ipfs://opepen' ], { account: VV })

      expect(await contract.read.getTokenMetadataURI([ 1n ])).to.equal('ipfs://opepen')
    })

    it('should not allow anyone but the owner to update the metadata URI', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await expect(contract.write.updateDefaultMetadataURI([ 'ipfs://jalil' ], { account: JALIL }))
        .to.be.reverted
    })
  })

  describe('Custom Set Metadata URI', function () {
    it('should allow setting the metadata URI', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await expect(contract.write.updateSetMetadataURI([ 1n, 'ipfs://set-1' ], { account: VV }))
        .not.to.be.reverted
    })

    it('should expose the set metadata URI', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await contract.write.updateSetMetadataURI([1n, 'ipfs://set-1' ], { account: VV })

      expect(await contract.read.setMetadataURIs([ 1n ])).to.equal('ipfs://set-1')
    })

    it('should return the set metadata URI if it is set', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await contract.write.updateSetMetadataURI([1n, 'ipfs://set-1' ], { account: VV })

      await contract.write.batchSaveTokenSets(prepareTokenSetsDataForSet(1), { account: VV })

      expect(await contract.read.getTokenMetadataURI([ 70n ])).to.equal('ipfs://set-1') // token 70 is part of set 1
    })

    it('should not allow anyone but the owner to update the metadata URI', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await expect(contract.write.updateSetMetadataURI([1n, 'ipfs://jalil' ], { account: JALIL }))
        .to.be.reverted
    })
  })

  describe('Custom Set Renderer', function () {
    it('should allow setting the set renderer', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await expect(contract.write.updateSetMetadataRenderer([ 1n, '0x000000000000000000000000000000000000dEaD' ], { account: VV }))
        .not.to.be.reverted
    })

    it('should expose the set renderer', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await contract.write.updateSetMetadataRenderer([ 1n, '0x000000000000000000000000000000000000dEaD' ], { account: VV })

      expect(await contract.read.setMetadataRenderers([ 1n ])).to.equal('0x000000000000000000000000000000000000dEaD')
    })

    it.skip('should return the set renderer tokenURI value if the renderer is set', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await contract.write.updateSetMetadataRenderer([ 1n, '0x000000000000000000000000000000000000dEaD' ], { account: VV })

      await contract.write.batchSaveTokenSets(prepareTokenSetsDataForSet(1), { account: VV })

      // TODO: Implement Mock
      expect(await contract.read.getTokenMetadataURI([ 70n ])).to.equal('hello-opepen') // token 70 is part of set 1
    })

    it('should not allow anyone but the owner to update the metadata URI', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await expect(contract.write.updateSetMetadataRenderer([ 1n, '0x000000000000000000000000000000000000dEaD' ], { account: JALIL }))
        .to.be.reverted
    })
  })
})
