// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import { MetadataRenderAdminCheck } from "./MetadataRenderAdminCheck.sol";
import { IMetadataRenderer } from "./interfaces/IMetadataRenderer.sol";
import { Utilities } from "./libraries/Utilities.sol";

/// @title The Opepen Archive Contract
/// @author VisualizeValue
/// @notice Manages Metadata for Opepens
contract TheOpepenArchiveV2 is IMetadataRenderer, MetadataRenderAdminCheck {
    /// @notice The Opepen Edition address
    address public edition = 0x6339e5E072086621540D0362C4e3Cea0d643E114;

    /// @dev Default metadata URI for tokens
    string public defaultMetadataURI;

    /// @dev Mapping of custom metadata URIs by key
    mapping(uint256 => string) public subEditionMetadataURIs;

    /// @dev Mapping of tokenID to custom edition metadata key
    mapping(uint256 => uint256) public tokenSubEditionKeys;

    /// @dev Mapping of tokenID to metadata URI
    mapping(uint256 => string) public tokenMetadataURIs;

    /// @notice Sets the default metadata URI for tokens
    /// @param metadataURI The metadata URI to set
    function setDefaultMetadataURI(string memory metadataURI) public requireSenderAdmin(edition) {
        defaultMetadataURI = metadataURI;
    }

    /// @notice Sets a custom metadata URI for a specific key
    /// @param key The key for which to set the metadata URI
    /// @param metadataURI The metadata URI to set
    function setCustomMetadataURI(uint256 key, string memory metadataURI) public requireSenderAdmin(edition) {
        subEditionMetadataURIs[key] = metadataURI;
    }

    /// @notice Links an array of tokenIDs to a custom key
    /// @param tokenIDs The array of tokenIDs to link
    /// @param key The key to link the tokens to
    function linkTokensToSubEditionMetadataKeys(uint256[] memory tokenIDs, uint256 key) public requireSenderAdmin(edition) {
        for (uint i = 0; i < tokenIDs.length; i++) {
            tokenSubEditionKeys[tokenIDs[i]] = key;
        }
    }

    /// @notice Links an array of tokenIDs to custom metadata URIs
    /// @param tokenIDs The array of tokenIDs to link
    /// @param uris The array of metadata URIs to link to the tokenIDs
    function setTokenMetadataURIs(uint256[] memory tokenIDs, string[] memory uris) public requireSenderAdmin(edition) {
        require(tokenIDs.length == uris.length, "Bad configuration.");

        for (uint i = 0; i < tokenIDs.length; i++) {
            tokenMetadataURIs[tokenIDs[i]] = uris[i];
        }
    }

    /// @notice Get the metadataURI for a specific token
    /// @param tokenID The array of tokenIDs to link
    function getTokenMetadataURI(uint256 tokenID) public view returns (string memory) {
        string memory tokenMetadataURI = tokenMetadataURIs[tokenID];

        if (bytes(tokenMetadataURI).length > 0) {
            return tokenMetadataURI;
        }

        uint256 subEdition = tokenSubEditionKeys[tokenID];
        if (subEdition > 0) {
            return subEditionMetadataURIs[subEdition];
        }

        return defaultMetadataURI;
    }
}
