import packedSets from './../data/token-packed-sets.json'
import sets from './../data/token-sets.json'

export const prepareTokenSetsData = (): [readonly bigint[], readonly bigint[]] => {
  const indices = [...Array(500).keys()].map(k => BigInt(k))
  const packedEditions = packedSets.map(n => BigInt(n))

  return [ indices, packedEditions ]
}

export const prepareTokenSetsDataForSet = (set: number): [readonly bigint[], readonly bigint[]] => {
  const tokens = Object.entries(sets).filter(([_, s]) => s === set).map(([token]) => token)

  // find slots – we have 32 sets per slot.
  // we resolve the slot and the position in the slot.
  const slots: [bigint, bigint][] = tokens.map(t => [BigInt(t) / 32n, BigInt(t) % 32n])

  const slotsToUpdate = slots.reduce((toUpdate: { [key: string]: bigint[] }, slot: [bigint, bigint]) => {
    const [slotIndex, setLocation] = slot
    if (! toUpdate[`${slotIndex}`]) toUpdate[`${slotIndex}`] = []

    toUpdate[`${slotIndex}`].push(setLocation)

    return toUpdate
  }, {})

  const indices = Object.keys(slotsToUpdate).map(k => BigInt(k))
  const packedEditions = packedSets.map(n => BigInt(n)).filter((_, i) => indices.includes(BigInt(i)))

  return [indices, packedEditions]
}

