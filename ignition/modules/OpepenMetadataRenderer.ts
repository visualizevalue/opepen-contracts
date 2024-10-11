import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const OpepenMetadataRendererModule = buildModule('OpepenMetadataRenderer', (m) => {
  const renderer = m.contract('OpepenMetadataRenderer', [ m.getParameter('archive') ])

  return { renderer }
})

export default OpepenMetadataRendererModule

