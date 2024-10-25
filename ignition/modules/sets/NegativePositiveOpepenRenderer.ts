import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const NegativePositiveOpepenRendererModule = buildModule('NegativePositiveOpepenRenderer', (m) => {
  const renderer = m.contract('NegativePositiveOpepenRenderer')

  return { renderer }
})

export default NegativePositiveOpepenRendererModule

