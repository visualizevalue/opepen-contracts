import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenArchiveFixture, opepenArchiveSavedEditionsFixture } from './fixtures'
import { prepareTokenSetsData, prepareTokenSetsDataForSet } from '../helpers/token-sets'
import { VV } from '../helpers/constants'

describe.only('TheOpepenArchive', function () {
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
})
