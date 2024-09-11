import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const OpepenMetadataLinkModule = buildModule('OpepenMetadataLink', (m) => {
  const metadataLinkRenderer = m.contract(
    'OpepenMetadataLink',
    [
      'https://metadata.opepen.art/opepen.json',
      'https://metadata.opepen.art'
    ]
  )

  return { metadataLinkRenderer }
})

export default OpepenMetadataLinkModule

