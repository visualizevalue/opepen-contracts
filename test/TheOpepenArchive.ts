import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenArchiveSavedEditionsFixture } from './fixtures'

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
})
