import { encodeAbiParameters } from 'viem'
import { toByteArray } from './arrays'

type SetData = {
  name: string
  description: string
  artist: string
  editionOne: string
  editionFour: string
  editionFive: string
  editionTen: string
  editionTwenty: string
  editionForty: string
  imageCid: string
  animationCid: string
}

export const prepareSetData = (data: SetData) => {
  const encoded = encodeAbiParameters(
    [
      {
        type: 'tuple',
        components: [
          { type: 'string', name: 'name' },
          { type: 'string', name: 'description' },
          { type: 'string', name: 'artist' },
          { type: 'string', name: 'editionOne' },
          { type: 'string', name: 'editionFour' },
          { type: 'string', name: 'editionFive' },
          { type: 'string', name: 'editionTen' },
          { type: 'string', name: 'editionTwenty' },
          { type: 'string', name: 'editionForty' },
          { type: 'string', name: 'imageCid' },
          { type: 'string', name: 'animationCid' },
        ]
      }
    ],
    [ data ]
  )

  return toByteArray(encoded)
}
