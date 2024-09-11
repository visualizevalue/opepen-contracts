import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'
import { prepareTokenEditionsData } from '../../helpers/token-editions'
import TheOpepenArchiveModule from './TheOpepenArchive'

const TheOpepenArchiveTokenEditionsModule = buildModule('TheOpepenArchiveTokenEditions', (m) => {
  const { archive } = m.useModule(TheOpepenArchiveModule)

  m.call(archive, 'batchSaveTokenEditions', prepareTokenEditionsData() as [ bigint[], bigint[] ])

  return { archive }
})

export default TheOpepenArchiveTokenEditionsModule
