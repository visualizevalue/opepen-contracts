import { expect } from 'chai'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { opepenArchiveSetPublishedFixture } from './fixtures'
import {
  ENCODED_SET_001_10_1,
  ENCODED_SET_001_10_10,
  ENCODED_SET_001_10_5,
  ENCODED_SET_001_1_1,
  ENCODED_SET_001_20_1,
  ENCODED_SET_001_20_10,
  ENCODED_SET_001_20_20,
  ENCODED_SET_001_40_1,
  ENCODED_SET_001_40_10,
  ENCODED_SET_001_40_20,
  ENCODED_SET_001_40_40,
  ENCODED_SET_001_4_1,
  ENCODED_SET_001_4_2,
  ENCODED_SET_001_4_3,
  ENCODED_SET_001_4_4,
  ENCODED_SET_001_5_1,
  ENCODED_SET_001_5_3,
  ENCODED_SET_001_5_5,
} from '../helpers/set-data'

describe('Onchain Opepen Set 001', function () {

  describe('1/1', () => {
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
  })

  describe('1/4', () => {
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

    it('should render the 2/4', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 14468n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.deep.equal(ENCODED_SET_001_4_2)
    })

    it('should render the 3/4', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 15205n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_4_3)
    })

    it('should render the 4/4', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 2461n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_4_4)
    })
  })

  describe('1/5', () => {
    it('should render the 1/5', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 4676n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data).to.deep.equal({
        "id": "4676",
        "name": "Set 001, 1/5 (#4676)",
        "description": "Consensus is temporary.",
        "image": ENCODED_SET_001_5_1,
        "attributes": [
          {
            "trait_type": "Edition Size",
            "value": "Five"
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
            "value": "IX"
          },
          {
            "trait_type": "Number",
            "value": 4676
          }
        ]
      })
    })

    it('should render the 3/5', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 7849n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_5_3)
    })

    it('should render the 5/5', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 8625n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_5_5)
    })
  })

  describe('1/10', () => {
    it('should render the 1/10', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 11106n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data).to.deep.equal({
        "id": "11106",
        "name": "Set 001, 1/10 (#11106)",
        "description": "Consensus is temporary.",
        "image": ENCODED_SET_001_10_1,
        "attributes": [
          {
            "trait_type": "Edition Size",
            "value": "Ten"
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
            "value": "V"
          },
          {
            "trait_type": "Number",
            "value": 11106
          }
        ]
      })
    })

    it('should render the 5/10', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 1035n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_10_5)
    })

    it('should render the 10/10', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 6010n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_10_10)
    })
  })

  describe('1/20', () => {
    it('should render the 1/20', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 4360n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data).to.deep.equal({
        "id": "4360",
        "name": "Set 001, 1/20 (#4360)",
        "description": "Consensus is temporary.",
        "image": ENCODED_SET_001_20_1,
        "attributes": [
          {
            "trait_type": "Edition Size",
            "value": "Twenty"
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
            "value": "III"
          },
          {
            "trait_type": "Number",
            "value": 4360
          }
        ]
      })
    })

    it('should render the 10/20', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 14532n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_20_10)
    })

    it('should render the 20/20', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 6527n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_20_20)
    })
  })


  describe('1/40', () => {
    it('should render the 1/40', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 14850n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data).to.deep.equal({
        "id": "14850",
        "name": "Set 001, 1/40 (#14850)",
        "description": "Consensus is temporary.",
        "image": ENCODED_SET_001_40_1,
        "attributes": [
          {
            "trait_type": "Edition Size",
            "value": "Forty"
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
            "value": "I"
          },
          {
            "trait_type": "Number",
            "value": 14850
          }
        ]
      })
    })

    it('should render the 10/40', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 5424n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_40_10)
    })

    it('should render the 20/40', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 4036n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_40_20)
    })

    it('should render the 40/40', async function () {
      const { renderer } = await loadFixture(opepenArchiveSetPublishedFixture)

      const dataURI = await renderer.read.tokenURI([ 14844n ])
      const json = Buffer.from(dataURI.substring(29), `base64`).toString()
      const data = JSON.parse(json)

      expect(data.image).to.equal(ENCODED_SET_001_40_40)
    })
  })

})

