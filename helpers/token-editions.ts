import packedTokenEditions from './../data/token-packed-editions.json'

export const prepareTokenEditionsData = (): [readonly bigint[], readonly bigint[]] => {
  const indices = [...Array(200).keys()].map(k => BigInt(k))
  const packedEditions = packedTokenEditions.map(n => BigInt(n))

  return [ indices, packedEditions ]
}

