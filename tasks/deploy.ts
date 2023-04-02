import { task } from 'hardhat/config'
import { deployOpepenMetadataLink } from '../helpers/deploy'

task('deploy:OpepenMetadataLink', 'Deploys the OpepenMetadataLink contract', async (_, hre) => {
  const { opepenMetadataLink } = await deployOpepenMetadataLink(hre.ethers)

  console.log(`Successfully deployed the OpepenMetadataLink contract at ${opepenMetadataLink.address}`)
})
