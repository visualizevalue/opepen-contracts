export const deployOpepenMetadataLink = async (ethers) => {
  const OpepenMetadataLink = await ethers.getContractFactory('OpepenMetadataLink')
  const opepenMetadataLink = await OpepenMetadataLink.deploy('https://asdfa', 'https://asdfasdfasdf')
  await opepenMetadataLink.deployed()
  console.log(`     Deployed OpepenMetadataLink at ${opepenMetadataLink.address}`)

  return {
    opepenMetadataLink,
  }
}

export const deployOpepenArchive = async (ethers) => {
  const TheOpepenArchive = await ethers.getContractFactory('TheOpepenArchive')
  const opepenArchive = await TheOpepenArchive.deploy()
  await opepenArchive.deployed()
  console.log(`     Deployed TheOpepenArchive at ${opepenArchive.address}`)

  return {
    opepenArchive,
  }
}
