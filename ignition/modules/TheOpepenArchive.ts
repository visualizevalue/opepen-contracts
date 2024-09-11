import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const TheOpepenArchiveModule = buildModule('TheOpepenArchive', (m) => {
  const archive = m.contract('TheOpepenArchive')

  return { archive }
})

export default TheOpepenArchiveModule

