import fs from 'fs'
import path from 'path'
import { task } from 'hardhat/config'
import edionSizes from './../data/token-edition.json'
import editionIndices from './../data/token-edition-index.json'

interface TokenEditions {
  [tokenId: string]: number
}

interface TokenEditionIndices extends TokenEditions {}

const EDITION_MAP: TokenEditionIndices = {
  '40': 0,
  '20': 1,
  '10': 2,
   '5': 3,
   '4': 4,
   '1': 5,
}

task('archive:prepare-rare', 'Prepare the rare opepen edition data', async (_, hre) => {
  const input: TokenEditions = edionSizes
  const mapped: TokenEditionIndices = {}

  for (const token of Object.keys(input)) {
    mapped[token] = EDITION_MAP[input[token]]
  }

  fs.writeFileSync(path.resolve(__dirname, '../data/token-edition-index.json'), JSON.stringify(mapped, null, 4))
})

task('archive:pack-rare', 'Pack token <> edition data', async () => {
  const packEditions = (editions: number[]): bigint => editions.reduce(
    (packed, edition, i) => packed | (BigInt(edition) << BigInt(i * 3)),
    0n
  )

  const data: TokenEditions = editionIndices

  const packedEditions: string[] = []

  for (let groupIndex = 0; groupIndex < 200; groupIndex++) {
    const currentEdition: number[] = []
    for (let tokenId = groupIndex * 80 + 1; tokenId <= (groupIndex + 1) * 80; tokenId++) {
      const edition = data[tokenId.toString()]
      if (edition === undefined) throw new Error(`Undefined edition for ${tokenId}`)
      currentEdition.push(edition)
    }

    const packed = packEditions(currentEdition)

    packedEditions.push(packed.toString())
  }

  fs.writeFileSync(path.resolve(__dirname, '../data/token-packed-editions.json'), JSON.stringify(packedEditions, null, 4))
})

