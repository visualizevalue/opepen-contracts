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

export const ENCODED_SET_001_1_1 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwMCIgaGVpZ2h0PSIxNDAwIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgZmlsbD0iIzAwMCIgLz48dXNlIHg9IjQ3MiIgeT0iMTMxIiB0cmFuc2Zvcm09InNjYWxlKDAuOCkiIGhyZWY9IiNjaGVjayIgZmlsbD0iI2ZmZiIgLz48Zz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjgsIDEyOCkiID48dXNlIGhyZWY9IiMxeDEiIGZpbGw9IiM1RkM5QkYiIC8+PHVzZSB4PSI2NCIgaHJlZj0iIzF4MV90ciIgZmlsbD0iIzlERUZCRiIgLz48dXNlIGhyZWY9IiNleWUiIC8+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI1NiwgMTI4KSI+PHVzZSBocmVmPSIjMXgxX3RsIiBmaWxsPSIjM0VCOEExIiAvPjx1c2UgeD0iNjQiIGhyZWY9IiMxeDFfdHIiIGZpbGw9IiM4M0YxQUUiIC8+PHVzZSBocmVmPSIjZXllIiAvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjgsIDI1NikiPjx1c2UgaHJlZj0iIzF4MSIgZmlsbD0iIzJFOUQ5QSIgLz48dXNlIHg9IjY0IiBocmVmPSIjMXgxIiBmaWxsPSIjNDI5MUE4IiAvPjx1c2UgeD0iMTI4IiBocmVmPSIjMXgxIiBmaWxsPSIjODZFNDhFIiAvPjx1c2UgeD0iMTkyIiBocmVmPSIjMXgxIiBmaWxsPSIjNzdFMzlGIiAvPjx1c2UgeT0iNjQiIGhyZWY9IiMxeDFfYmwiIGZpbGw9IiM2QUQxREUiIC8+PHVzZSB4PSI2NCIgeT0iNjQiIGhyZWY9IiMxeDEiIGZpbGw9IiM1RkNEOEMiIC8+PHVzZSB4PSIxMjgiIHk9IjY0IiBocmVmPSIjMXgxIiBmaWxsPSIjNzdEM0RFIiAvPjx1c2UgeD0iMTkyIiB5PSI2NCIgaHJlZj0iIzF4MV9iciIgZmlsbD0iI0I1RjEzQiIgLz48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI4LCA0NDgpIj48dXNlIGhyZWY9IiMxeDFfdGwiIGZpbGw9IiNBN0NBNDUiIC8+PHVzZSB4PSI2NCIgaHJlZj0iIzF4MSIgZmlsbD0iIzYzQzIzQyIgLz48dXNlIHg9IjEyOCIgaHJlZj0iIzF4MSIgZmlsbD0iIzgxRDFFQyIgLz48dXNlIHg9IjE5MiIgaHJlZj0iIzF4MV90ciIgZmlsbD0iIzk0RTMzNyIgLz48L2c+PC9nPjxkZWZzPjxyZWN0IGlkPSIxeDEiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgLz48cGF0aCBpZD0iMXgxX3RsIiBkPSJNIDY0IDBBIDY0IDY0LCAwLCAwLCAwLCAwIDY0TCA2NCA2NCBaIi8+PHBhdGggaWQ9IjF4MV90ciIgZD0iTSAwIDBBIDY0IDY0LCAwLCAwLCAxLCA2NCA2NEwgMCA2NCBaIi8+PHBhdGggaWQ9IjF4MV9ibCIgZD0iTSAwIDBBIDY0IDY0LCAwLCAwLCAwLCA2NCA2NEwgNjQgMCBaIi8+PHBhdGggaWQ9IjF4MV9iciIgZD0iTSA2NCAwQSA2NCA2NCwgMCwgMCwgMSwgMCA2NEwgMCAwIFoiLz48cGF0aCBpZD0iY2hlY2siIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTIxLjM2IDkuODg2QTMuOTMzIDMuOTMzIDAgMCAwIDE4IDhjLTEuNDIzIDAtMi42Ny43NTUtMy4zNiAxLjg4N2EzLjkzNSAzLjkzNSAwIDAgMC00Ljc1MyA0Ljc1M0EzLjkzMyAzLjkzMyAwIDAgMCA4IDE4YzAgMS40MjMuNzU1IDIuNjY5IDEuODg2IDMuMzZhMy45MzUgMy45MzUgMCAwIDAgNC43NTMgNC43NTMgMy45MzMgMy45MzMgMCAwIDAgNC44NjMgMS41OSAzLjk1MyAzLjk1MyAwIDAgMCAxLjg1OC0xLjU4OSAzLjkzNSAzLjkzNSAwIDAgMCA0Ljc1My00Ljc1NEEzLjkzMyAzLjkzMyAwIDAgMCAyOCAxOGEzLjkzMyAzLjkzMyAwIDAgMC0xLjg4Ny0zLjM2IDMuOTM0IDMuOTM0IDAgMCAwLTEuMDQyLTMuNzExIDMuOTM0IDMuOTM0IDAgMCAwLTMuNzEtMS4wNDNabS0zLjk1OCAxMS43MTMgNC41NjItNi44NDRjLjU2Ni0uODQ2LS43NTEtMS43MjQtMS4zMTYtLjg3OGwtNC4wMjYgNi4wNDMtMS4zNzEtMS4zNjhjLS43MTctLjcyMi0xLjgzNi4zOTYtMS4xMTYgMS4xMTZsMi4xNyAyLjE1YS43ODguNzg4IDAgMCAwIDEuMDk3LS4yMloiIC8+PGcgaWQ9ImV5ZSI+PHVzZSB5PSI2NCIgaHJlZj0iIzF4MV9ibCIgZmlsbD0iI2ZmZiIgLz48dXNlIHg9IjY0IiB5PSI2NCIgaHJlZj0iIzF4MV9iciIgZmlsbD0iIzAwMCIgLz48L2c+PC9kZWZzPjwvc3ZnPg==`

