// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { MetadataRenderAdminCheck } from "./MetadataRenderAdminCheck.sol";

/// @title The Opepen Archive Contract
/// @author VisualizeValue
/// @notice Manages Metadata for Opepens
contract TheOpepenArchive is MetadataRenderAdminCheck {
    /// @notice The Opepen Edition address
    address public constant EDITION = 0x6339e5E072086621540D0362C4e3Cea0d643E114;

    uint8[6] public EDITION_SIZES = [40, 20, 10, 5, 4, 1];

    /// @dev We store 80 token categories in a single uint256;
    ///      Each category takes 3 bits (we use decimals 0-5 to identify the six different edition types)
    mapping(uint256 => uint256) private tokenEditions;

    /// @dev Mapping from packed token IDs to their corresponding set ID
    //       We store 32 token sets in a single uint256 (8 bit per set fits 32)
    mapping(uint256 => uint256) private tokenSets;

    /// @dev Default metadata URI for tokens
    string public defaultMetadataURI;

    /// @dev Mapping of custom metadata URIs by set id (0-200)
    mapping(uint256 => string) public setMetadataURIs;

    /// @dev Mapping of tokenID to custom edition metadata key TODO: Rework this into packed data?
    mapping(uint256 => uint256) public tokenSubEditionKeys;

    /// @notice Sets the default metadata URI for tokens
    /// @param metadataURI The metadata URI to set
    function setDefaultMetadataURI(string memory metadataURI) public requireSenderAdmin(EDITION) {
        defaultMetadataURI = metadataURI;
    }

    /// @notice Sets a custom metadata URI for a specific set
    /// @param id The id of the set for which to store the metadata URI
    /// @param metadataURI The metadata URI to set
    function setCustomMetadataURI(uint256 id, string memory metadataURI) public requireSenderAdmin(EDITION) {
        setMetadataURIs[id] = metadataURI;
    }

    /// @notice Links an array of tokenIDs to a custom key
    /// @param tokenIDs The array of tokenIDs to link
    /// @param key The key to link the tokens to
    function linkTokensToSubEditionMetadataKeys(uint256[] memory tokenIDs, uint256 key) public requireSenderAdmin(EDITION) {
        for (uint i = 0; i < tokenIDs.length; i++) {
            tokenSubEditionKeys[tokenIDs[i]] = key;
        }
    }

    /// @notice Get the metadataURI for a specific token
    /// @param tokenID The array of tokenIDs to link
    function getTokenMetadataURI(uint256 tokenID) public view returns (string memory) {
        uint256 subEdition = tokenSubEditionKeys[tokenID];
        if (subEdition > 0) {
            return setMetadataURIs[subEdition];
        }

        return defaultMetadataURI;
    }

    /// @notice Batch save token edition sizes
    function batchSaveTokenEditions(uint256[] calldata groupIndices, uint256[] calldata editions) external requireSenderAdmin(EDITION) {
        require(groupIndices.length == editions.length, "Input array length mismatch.");

        for (uint256 i = 0; i < groupIndices.length; i++) {
            tokenEditions[groupIndices[i]] = editions[i];
        }
    }

    /// @notice Get the edition size for a token
    function getTokenEdition(uint256 tokenId) external view returns (uint8) {
        uint256 groupIndex = (tokenId - 1) / 80;
        uint8 bitPosition = uint8(((tokenId - 1) % 80) * 3);

        uint256 packed = tokenEditions[groupIndex];
        return EDITION_SIZES[(packed >> bitPosition) & 7];
    }

    /// @notice Batch save token sets
    function batchSaveTokenSets(uint256[] calldata groupIndices, uint256[] calldata sets) external requireSenderAdmin(EDITION) {
        require(groupIndices.length == sets.length, "Input array length mismatch.");

        for (uint256 i = 0; i < groupIndices.length; i++) {
            tokenSets[groupIndices[i]] = sets[i];
        }
    }

    /// @notice Get the set for a token
    function getTokenSet(uint256 tokenId) external view returns (uint8) {
        uint256 tokenGroup = tokenId / 32;
        uint256 tokenPosition = tokenId % 32;
        uint256 packedSetIds = tokenToSetMapping[tokenGroup];
        return uint8((packedSetIds >> (tokenPosition * 8)) & 255);
    }
}

