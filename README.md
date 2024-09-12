# Opepen Contracts V3

## Architecture

The setup for rendering Opepen metadata:

![Opepen Architecture](./opepen-archive-architecture.excalidraw.png)

We want to be able to resolve the edition size for each token without leaving the EVM.

- We have 6 edition sizes. To identify each of them we need 3 bits (`110` would be `6`).
- Per slot (256 bits) we can store up to 85 tokens (`256/3 = 85.33`)
- So we batch store the token ID -> edition size in 200 groups of 80 (just because of the provenance of 200 & 80 in opepen land)

Further, we need to resolve the set for each token onchain.

- We have 200 sets, identified by a byte (uint8 < 256)
- We can fit 32 sets in one storage slot.
- We batch store the token ID -> set in 500 groups of 32.

TheOpepenArchive.sol has to be able to register custom renderers per set, or a custom metadata URI (e.g. to permanently store individual sets on IPFS).

The OpepenMetadataRenderer.sol implements the necessary interfaces to make it work as a drop in replacement for the Zora renderer. It queries `TheOpepenArchive.sol` for individual token metadata URIs.

## Working with Hardhat

Copy the environment variables (and fill them out): `cp .env.example .env`

Try running some of the following tasks:

```bash
npx hardhat accounts # or the shorthand via `hh accounts`
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat help
```

## Deploying contracts

We use [Ignition](https://hardhat.org/ignition/docs/getting-started#overview) for contract deployments.

```bash
hh node # start a local node

hh ignition deploy ./ignition/modules/TheOpepenArchive.ts --network localhost # deploy the opepen archive contract

hh ignition deploy ./ignition/modules/TheOpepenArchiveTokenEditions.ts --network localhost # batch save token editions
```
```
```
