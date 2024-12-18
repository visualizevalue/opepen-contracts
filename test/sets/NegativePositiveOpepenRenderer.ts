import hre from 'hardhat'
import { expect } from 'chai'
import { ENCODED_VISUALS } from '../../helpers/set-data'
import Set058RendererModule from '../../ignition/modules/sets/NegativePositiveOpepenRenderer'
import parameters from '../../ignition/parameters.json'

describe('Onchain "Negative, Positive" Opepen Set', function () {

  it('should render the negative', async function () {
    const { renderer } = await hre.ignition.deploy(Set058RendererModule, {
      parameters: parameters
    })

    expect(await renderer.read.imageUrl([0n, 1n, 0n])).to.equal(ENCODED_VISUALS.NEGATIVE_POSITIVE.NEGATIVE)
  })

  it('should render the positive', async function () {
    const { renderer } = await hre.ignition.deploy(Set058RendererModule, {
      parameters: parameters
    })

    expect(await renderer.read.imageUrl([0n, 4n, 1n])).to.equal(ENCODED_VISUALS.NEGATIVE_POSITIVE.POSITIVE)
  })

})

