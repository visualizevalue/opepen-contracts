import hre from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenArchiveFixture, opepenArchiveSavedEditionsFixture } from './fixtures'
import { prepareTokenSetsAndEditionsInput, prepareTokenSetsAndEditionsInputForSet } from '../helpers/token-sets'
import { prepareSetData } from '../helpers/set-data'
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

      await contract.write.batchSaveTokenSets(prepareTokenSetsAndEditionsInput())

      expect(await contract.read.getTokenSet([1n])).to.equal(0)

      expect(await contract.read.getTokenSet([7n])).to.equal(30)
      expect(await contract.read.getTokenSet([20n])).to.equal(49)
      expect(await contract.read.getTokenSetEditionId([7n])).to.equal(4)
      expect(await contract.read.getTokenSetEditionId([20n])).to.equal(8)

      expect(await contract.read.getTokenSet([69n])).to.equal(0)
      expect(await contract.read.getTokenSet([70n])).to.equal(1)
      expect(await contract.read.getTokenSet([71n])).to.equal(7)
      expect(await contract.read.getTokenSetEditionId([69n])).to.equal(0)
      expect(await contract.read.getTokenSetEditionId([70n])).to.equal(2)
      expect(await contract.read.getTokenSetEditionId([71n])).to.equal(11)

      expect(await contract.read.getTokenSet([151n])).to.equal(1)
      expect(await contract.read.getTokenSet([4036n])).to.equal(1)
      expect(await contract.read.getTokenSet([15446n])).to.equal(1)
      expect(await contract.read.getTokenSetEditionId([151n])).to.equal(1)
      expect(await contract.read.getTokenSetEditionId([4036n])).to.equal(20)
      expect(await contract.read.getTokenSetEditionId([15446n])).to.equal(14)
    })

    it('should allow storing a single set for tokens', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)

      await contract.write.batchSaveTokenSets(prepareTokenSetsAndEditionsInputForSet(1))

      expect(await contract.read.getTokenSet([70n])).to.equal(1)

      expect(await contract.read.getTokenSet([151n])).to.equal(1)
      expect(await contract.read.getTokenSet([4036n])).to.equal(1)
      expect(await contract.read.getTokenSet([15446n])).to.equal(1)

      await contract.write.batchSaveTokenSets(prepareTokenSetsAndEditionsInputForSet(2))

      expect(await contract.read.getTokenSet([100n])).to.equal(2)
    })
  })

  describe('Custom Set Renderer', function () {
    it('should allow setting the set renderer', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await expect(contract.write.updateSetArtifactRenderer([ 1n, '0x000000000000000000000000000000000000dEaD' ]))
        .not.to.be.reverted
    })

    it('should expose the set renderer', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await contract.write.updateSetArtifactRenderer([ 1n, '0x000000000000000000000000000000000000dEaD' ])

      expect(await contract.read.setArtifactRenderer([ 1n ])).to.equal('0x000000000000000000000000000000000000dEaD')
    })

    it.skip('should return the set renderer tokenURI value if the renderer is set', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      const mockRenderer = await hre.viem.deployContract('Set1RendererMock');

      await contract.write.updateSetArtifactRenderer([ 1n, mockRenderer.address ])

      await contract.write.batchSaveTokenSets(prepareTokenSetsAndEditionsInputForSet(1))

      // expect(await contract.read.getTokenMetadataURI([ 70n ])).to.equal('hello-opepen-set-1') // token 70 is part of set 1
    })

    it('should not allow anyone but the owner to update the metadata URI', async function () {
      const { contract } = await loadFixture(opepenArchiveSavedEditionsFixture)

      await expect(contract.write.updateSetArtifactRenderer([ 1n, '0x000000000000000000000000000000000000dEaD' ], { account: JALIL }))
        .to.be.reverted
    })
  })

  describe('Publishing Set Reveal Data', function () {
    it('should allow publishing set reveal data', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)
      await expect(contract.write.publishSetRevealData([ 1n, 100, 111n ], { account: VV }))
        .to.be.revertedWithCustomError(contract, 'ManagerUnauthorizedAccount')

      await expect(contract.write.publishSetRevealData([ 1n, 100, 111n ]))
        .not.to.be.reverted

      const [ block, proof ] = await contract.read.getSetRevealData([ 1n ])
      expect(block).to.equal(100)
      expect(proof).to.equal(111n)
    })

    it('should preven re-publishing set reveal data', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)

      await contract.write.publishSetRevealData([ 1n, 100, 111n ])

      await expect(contract.write.publishSetRevealData([ 1n, 101, 999n ]))
        .to.be.revertedWithCustomError(contract, 'RevealDataPublished')
    })
  })

  describe('Set Data', function () {
    it('allows fetching empty set data', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)

      const setData = await contract.read.getSetData([ 1n ])

      expect(setData).to.deep.equal({
        name: '',
        description: '',
        artist: '',
        editionOne: '',
        editionFour: '',
        editionFive: '',
        editionTen: '',
        editionTwenty: '',
        editionForty: '',
        imageCid: '',
        animationCid: '',
      })
    })

    it('allows storing set data', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)

      const data = {
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

      await contract.write.updateSetData([
        1n,
        prepareSetData(data)
      ])

      const setData = await contract.read.getSetData([ 1n ])

      expect(setData).to.deep.equal(data)
    })
  })

  describe('Locking Sets', function () {
    it('should expose sets as unlocked', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)

      expect(await contract.read.setLocked([1n])).to.be.false
    })

    it('should allow locking sets', async function () {
      const { contract } = await loadFixture(opepenArchiveFixture)

      await expect(contract.write.lockSet([ 1n ]))
        .to.emit(contract, 'SetLocked')
        .withArgs(1)

      expect(await contract.read.setLocked([1n])).to.be.true
    })
  })
})
