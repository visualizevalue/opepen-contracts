// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./interfaces/IOpepenSetMetadataRenderer.sol";
import "./MetadataRenderAdminCheck.sol";

/// @title The Opepen Archive Contract
/// @author VisualizeValue
/// @notice Manages Metadata for Opepens
contract TheOpepenArchive is MetadataRenderAdminCheck {
    /// @notice The Opepen Edition address
    address public constant EDITION = 0x6339e5E072086621540D0362C4e3Cea0d643E114;

    /// @notice There are six different edition sizes in the Opepen Edition
    uint8[6] public EDITION_SIZES = [40, 20, 10, 5, 4, 1];

    /// @notice Default metadata URI
    string public defaultMetadataURI;

    /// @notice Mapping of custom metadata renderer contracts by set id (0-200)
    mapping(uint256 => string) public setMetadataURIs;

    /// @notice Mapping of custom metadata renderers by set id (0-200)
    mapping(uint256 => address) public setMetadataRenderers;

    /// @dev We store 80 token categories in a single uint256;
    ///      Each category takes 3 bits (we use decimals 0-5 to identify the six different edition types)
    mapping(uint256 => uint256) private tokenEditions;

    /// @dev Mapping from packed token IDs to their corresponding set ID
    //       We store 32 token sets in a single uint256 (8 bit per set fits 32)
    mapping(uint256 => uint256) private tokenSets;

    /// @notice Get the edition size for a token
    function getTokenEdition(uint256 tokenID) external view returns (uint8) {
        uint256 groupIndex = (tokenID - 1) / 80;
        uint8 bitPosition = uint8(((tokenID - 1) % 80) * 3);

        uint256 packed = tokenEditions[groupIndex];
        return EDITION_SIZES[(packed >> bitPosition) & 7];
    }

    /// @notice Get the set for a token
    function getTokenSet(uint256 tokenID) public view returns (uint8) {
        uint256 tokenGroup = (tokenID - 1) / 32;
        uint256 tokenPosition = (tokenID - 1) % 32;
        uint256 packedSetIds = tokenSets[tokenGroup];
        return uint8((packedSetIds >> (tokenPosition * 8)) & 255);
    }

    /// @notice Get the metadataURI for a specific token
    /// @param tokenID The token id for which to fetch the metadata uri
    function getTokenMetadataURI(uint256 tokenID) public view returns (string memory) {
        uint8 set = getTokenSet(tokenID);

        address setRenderer = setMetadataRenderers[set];
        if (setRenderer != address(0)) {
            return IOpepenSetMetadataRenderer(setRenderer).tokenURI(tokenID);
        }

        string memory setMetadataURI = setMetadataURIs[set];
        if (bytes(setMetadataURI).length > 0) {
            return setMetadataURI;
        }

        return defaultMetadataURI;
    }

    /// @notice Update the default metadata URI for tokens
    /// @param metadataURI The metadata URI to set
    function updateDefaultMetadataURI(string memory metadataURI) public requireSenderAdmin(EDITION) {
        defaultMetadataURI = metadataURI;
    }

    /// @notice Update a custom metadata URI for a specific set
    /// @param id The id of the set for which to store the metadata URI
    /// @param metadataURI The metadata URI to set
    function updateSetMetadataURI(uint256 id, string memory metadataURI) public requireSenderAdmin(EDITION) {
        setMetadataURIs[id] = metadataURI;
    }

    /// @notice Update a custom metadata renderer for a specific set
    /// @param id The id of the set for which to store the metadata URI
    /// @param renderer The renderer contract address to set
    function updateSetMetadataRenderer(uint256 id, address renderer) public requireSenderAdmin(EDITION) {
        setMetadataRenderers[id] = renderer;
    }

    /// @notice Batch save token edition sizes
    function batchSaveTokenEditions(uint256[] calldata groupIndices, uint256[] calldata editions) external requireSenderAdmin(EDITION) {
        require(groupIndices.length == editions.length, "Input array length mismatch.");

        for (uint256 i = 0; i < groupIndices.length; i++) {
            tokenEditions[groupIndices[i]] = editions[i];
        }
    }

    /// @notice Batch save token sets
    function batchSaveTokenSets(uint256[] calldata groupIndices, uint256[] calldata sets) external requireSenderAdmin(EDITION) {
        require(groupIndices.length == sets.length, "Input array length mismatch.");

        for (uint256 i = 0; i < groupIndices.length; i++) {
            tokenSets[groupIndices[i]] = sets[i];
        }
    }
}

