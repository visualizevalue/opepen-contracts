import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenArchiveSetPublishedFixture } from './fixtures'
import {
  ENCODED_SET_001_1_1,
  ENCODED_SET_001_4_1,
} from '../helpers/set-data'

describe.only('OpepenSet001', function () {
  it('render the 1/1', async function () {
    const { contract } = await loadFixture(opepenArchiveSetPublishedFixture)

    expect(await contract.read.getTokenSet([70n])).to.equal(1)
  })

  it('should render the 1/1', async function () {
    const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

    const dataURI = await renderer.read.tokenURI([ 151n ])
    const json = Buffer.from(dataURI.substring(29), `base64`).toString()
    const data = JSON.parse(json)

    expect(data).to.deep.equal({
      "id": "151",
      "name": "Set 001, 1/1 (#151)",
      "description": "Consensus is temporary.",
      "image": ENCODED_SET_001_1_1,
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

  it('should render the 1/4', async function () {
    const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

    const dataURI = await renderer.read.tokenURI([ 2912n ])
    const json = Buffer.from(dataURI.substring(29), `base64`).toString()
    const data = JSON.parse(json)

    expect(data).to.deep.equal({
      "id": "2912",
      "name": "Set 001, 1/4 (#2912)",
      "description": "Consensus is temporary.",
      "image": ENCODED_SET_001_4_1,
      "attributes": [
        {
          "trait_type": "Edition Size",
          "value": "Four"
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
          "value": "XII"
        },
        {
          "trait_type": "Number",
          "value": 2912
        }
      ]
    })
  })
})

