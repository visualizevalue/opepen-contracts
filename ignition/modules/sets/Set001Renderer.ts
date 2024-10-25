import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const Set001RendererModule = buildModule('Set001Renderer', (m) => {
  const eightyColors = m.contractAt('EightyColors', m.getParameter('eightyColors'))

  const renderer = m.contract('Set001Renderer', [], {
    libraries: {
      EightyColors: eightyColors,
    }
  })

  return { renderer }
})

export default Set001RendererModule

