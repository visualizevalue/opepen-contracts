import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const NegativePositiveOpepenRendererModule = buildModule('NegativePositiveOpepenRenderer', (m) => {
  const renderer = m.contract('NegativePositiveOpepenRenderer', [m.getParameter('signatures'), m.getParameter('signer')])

  return { renderer }
})

export default NegativePositiveOpepenRendererModule

