// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { MetadataRenderAdminCheck } from "./MetadataRenderAdminCheck.sol";

/// @title The Opepen Archive Contract
/// @author VisualizeValue
/// @notice Manages Metadata for Opepens
contract TheOpepenArchive is MetadataRenderAdminCheck {
    /// @notice The Opepen Edition address
    address public constant EDITION = 0x6339e5E072086621540D0362C4e3Cea0d643E114;

    /// @dev Default metadata URI for tokens
    string public defaultMetadataURI;

    /// @dev Mapping of custom metadata URIs by set id (0-200)
    mapping(uint256 => string) public setMetadataURIs;

    /// @dev Mapping of tokenID to custom edition metadata key TODO: Rework this into packed data?
    mapping(uint256 => uint256) public tokenSubEditionKeys;

    /// @notice Sets the default metadata URI for tokens
    /// @param metadataURI The metadata URI to set
    function setDefaultMetadataURI(string memory metadataURI) public onlyAdmin {
        defaultMetadataURI = metadataURI;
    }

    /// @notice Sets a custom metadata URI for a specific set
    /// @param id The id of the set for which to store the metadata URI
    /// @param metadataURI The metadata URI to set
    function setCustomMetadataURI(uint256 id, string memory metadataURI) public onlyAdmin {
        setMetadataURIs[key] = metadataURI;
    }

    /// @notice Links an array of tokenIDs to a custom key
    /// @param tokenIDs The array of tokenIDs to link
    /// @param key The key to link the tokens to
    function linkTokensToSubEditionMetadataKeys(uint256[] memory tokenIDs, uint256 key) public onlyAdmin {
        for (uint i = 0; i < tokenIDs.length; i++) {
            tokenSubEditionKeys[tokenIDs[i]] = key;
        }
    }

    /// @notice Links an array of tokenIDs to custom metadata URIs TODO: Rework this into packed data?
    /// @param tokenIDs The array of tokenIDs to link
    /// @param uris The array of metadata URIs to link to the tokenIDs
    function setTokenMetadataURIs(uint256[] memory tokenIDs, string[] memory uris) public onlyAdmin {
        require(tokenIDs.length == uris.length, "Bad configuration.");

        for (uint i = 0; i < tokenIDs.length; i++) {
            tokenMetadataURIs[tokenIDs[i]] = uris[i];
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

    /// @dev Only allow VV to update the archive
    modifier onlyAdmin internal requireSenderAdmin(EDITION) {
        _;
    }
}
