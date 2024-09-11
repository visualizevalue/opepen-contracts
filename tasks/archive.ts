import fs from 'fs'
import path from 'path'
import { task } from 'hardhat/config'
import edionSizes from './../data/token-edition.json'
import editionIndices from './../data/token-edition-index.json'
import tokenSets from './../data/token-sets.json'

interface KeyedNumbers {
  [tokenId: string]: number
}
interface TokenEditions extends KeyedNumbers {}
interface TokenEditionIndices extends KeyedNumbers {}
interface TokenSets extends KeyedNumbers {}

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

task('archive:pack-sets', 'Pack token <> sets data', async () => {
  const packSets = (sets: number[]): bigint => sets.reduce(
    (packed, set, i) => packed | (BigInt(set) << BigInt(i * 8)),
    0n
  )

  const data: TokenSets = tokenSets
  const packedSets: string[] = []

  for (let groupIndex = 0; groupIndex < 500; groupIndex++) {
    const currentSets: number[] = []
    for (let tokenId = groupIndex * 32 + 1; tokenId <= (groupIndex + 1) * 32; tokenId++) {
      const set = data[tokenId.toString()]
      if (set === undefined) throw new Error(`Undefined set for ${tokenId}`)
      currentSets.push(set)
    }

    const packed = packSets(currentSets)

    packedSets.push(packed.toString())
  }

  fs.writeFileSync(path.resolve(__dirname, '../data/token-packed-sets.json'), JSON.stringify(packedSets, null, 4))
})

