import hre from 'hardhat'
import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenArchiveSetPublishedFixture } from './fixtures'

describe('OpepenSet001', function () {
  it('render the 1/1', async function () {
    const { contract } = await loadFixture(opepenArchiveSetPublishedFixture)

    expect(await contract.read.getTokenSet([70n])).to.equal(1)
  })
})

