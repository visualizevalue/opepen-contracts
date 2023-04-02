import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Contract } from 'ethers'
import { impersonate } from '../helpers/impersonate'
import { VV } from '../helpers/constants'
const hre = require('hardhat')

describe('OpepenMetadataLink', function () {
  let contract: Contract
  let admin: SignerWithAddress
  let signers: SignerWithAddress[]

  beforeEach(async () => {
    // Deploy the contract
    const contractFactory = await ethers.getContractFactory('OpepenMetadataLink')
    contract = await contractFactory.deploy('https://example.com/contract', 'https://example.com/tokens')
    await contract.deployed()

    // Get an admin account to perform admin actions
    admin = await impersonate(VV, hre)
    signers = await ethers.getSigners()
  })

  describe('contractURI', function () {
    it('should return the contract URI', async function () {
      expect(await contract.contractURI()).to.equal('https://example.com/contract')
    })
  })

  describe('tokenURI', function () {
    it('should return the token URI', async function () {
      expect(await contract.tokenURI(1)).to.equal('https://example.com/tokens/1/metadata.json')
    })
  })

  describe('setContractURI', function () {
    it('should set the contract URI', async function () {
      const newURI = 'https://example.com/new-contract'
      await contract.connect(admin).setContractURI(newURI)
      expect(await contract.contractURI()).to.equal(newURI)
    })

    it('should revert if not called by an admin', async function () {
      await expect(contract.connect(signers[0]).setContractURI('https://example.com/new-contract'))
        .to.be.revertedWithCustomError(contract, 'Access_OnlyAdmin')
    })
  })

  describe('setBaseURI', function () {
    it('should set the base URI', async function () {
      const newURI = 'https://example.com/new-tokens'
      await contract.connect(admin).setBaseURI(newURI)
      expect(await contract.tokenURI(1)).to.equal(`${newURI}/1/metadata.json`)
    })

    it('should revert if not called by an admin', async function () {
      await expect(contract.setBaseURI('https://example.com/new-tokens'))
        .to.be.revertedWithCustomError(contract, 'Access_OnlyAdmin')
    })
  })

  describe('Connect Renderer', function () {
    it('should revert if not called by the edition', async function () {
      await expect(contract.pingMetadataUpdate('0x123456789abcdef'))
        .to.be.revertedWith('Only the opepen edition can ping for an update.')
    })

    it('should emit Metadata Update events when pinging the renderer', async function () {
      const metadataHash = '0x123456789abcdef'
      const opepenContract = await ethers.getContractAt('ZoraEdition', '0x6339e5E072086621540D0362C4e3Cea0d643E114')

      // Switch the metadata renderer
      await opepenContract.connect(admin).setMetadataRenderer(contract.address, ethers.utils.arrayify(0))
      expect(await opepenContract.metadataRenderer()).to.equal(contract.address)

      // Contract ABI
      const abi = [
        'function pingMetadataUpdate(string memory metadataHash) external'
      ];

      // Encode the function selector and arguments
      const iface = new ethers.utils.Interface(abi);
      const calldata = iface.encodeFunctionData('pingMetadataUpdate', [metadataHash]);

      await expect(opepenContract.connect(admin).callMetadataRenderer(calldata))
        .to.emit(opepenContract, 'BatchMetadataUpdate').withArgs(1, 15985)
        .to.emit(contract, 'MetadataUpdate').withArgs(metadataHash)
    })

    it('link to the correct metadata urls', async function () {
      // Switch the metadata renderer
      const opepenContract = await ethers.getContractAt('ZoraEdition', '0x6339e5E072086621540D0362C4e3Cea0d643E114')
      await opepenContract.connect(admin).setMetadataRenderer(contract.address, ethers.utils.arrayify(0))

      expect(await opepenContract.contractURI()).to.equal('https://example.com/contract')
      expect(await opepenContract.tokenURI(1)).to.equal('https://example.com/tokens/1/metadata.json')
    })
  })
})
