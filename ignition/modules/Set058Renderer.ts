import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const Set058RendererModule = buildModule('Set058Renderer', (m) => {
  const renderer = m.contract('Set058Renderer')

  return { renderer }
})

export default Set058RendererModule

