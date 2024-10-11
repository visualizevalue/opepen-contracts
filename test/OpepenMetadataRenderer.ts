import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenMetadataRendererFixture } from './fixtures'

describe('OpepenMetadataRenderer', function () {

  it('should expose the archive contract it uses', async function () {
    const { contract, renderer } = await loadFixture(opepenMetadataRendererFixture)

    expect(await renderer.read.archive()).to.equal(contract.address)
  })

  it('should render metadata for unrevealed tokens', async function () {
    const { renderer } = await loadFixture(opepenMetadataRendererFixture)

    const dataURI = await renderer.read.tokenURI([ 1n ])
    const json = Buffer.from(dataURI.substring(29), `base64`).toString()
    const data = JSON.parse(json)

    expect(data).to.deep.equal({
      "id": "1",
      "name": "Unrevealed, 1/5 (#1)",
      "description": "Consensus is temporary.",
      "image": "ipfs://QmVXvZ5Sp6aSDBrWvtJ5gZ3bwNWRqqY3iPvyF8nveWj5HF/5.png",
      "attributes": [
        {
          "trait_type": "Edition Size",
          "value": "Five"
        },
        {
          "trait_type": "Revealed",
          "value": "No"
        },
        {
          "trait_type": "Number",
          "value": 1
        }
      ]
    })
  })

  it('should render metadata for revealed tokens', async function () {
    const { renderer } = await loadFixture(opepenMetadataRendererFixture)

    const dataURI = await renderer.read.tokenURI([ 151n ])
    const json = Buffer.from(dataURI.substring(29), `base64`).toString()
    const data = JSON.parse(json)

    expect(data).to.deep.equal({
      "id": "151",
      "name": "Set 001, 1/1 (#151)",
      "description": "Consensus is temporary.",
      // TODO: Implement custom renderer
      "image": "hello-opepen-set-1",
      "attributes": [
        {
          "trait_type": "Edition Size",
          "value": "One"
        },
        {
          "trait_type": "Revealed",
          "value": "Yes"
        },
        {
          "trait_type": "Release",
          "value": "001"
        },
        {
          "trait_type": "Set",
          "value": "8x8"
        },
        {
          "trait_type": "Artist",
          "value": "Jack Butcher"
        },
        {
          "trait_type": "Opepen",
          "value": "XVI"
        },
        {
          "trait_type": "Number",
          "value": 151
        }
      ]
    })
  })

})

