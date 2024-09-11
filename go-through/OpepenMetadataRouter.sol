// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IOpepenSetMetadataRenderer.sol";

// TODO:
// - default tokenURI
// - map token id to set
// - map set to set metadata renderer address


/// @title The Opepen Metadata Router Contract
/// @author VisualizeValue
/// @notice Defines sets for token IDs and routes token URIs to custom set metadata renderers
contract OpepenMetadataRouter is Ownable {

    /// @dev Default metadata URI for tokens
    string public defaultMetadataURI;

    /// @dev Mapping of custom metadata URIs by key
    mapping(uint256 => address) public setRenderers;

    /// @dev Mapping of tokenID to custom edition metadata key
    mapping(uint256 => uint256) public tokenSet;

    /// @notice Sets the default metadata URI for tokens
    /// @param metadataURI The metadata URI to set
    function setDefaultMetadataURI(string memory metadataURI) public onlyOwner {
        defaultMetadataURI = metadataURI;
    }

    /// @notice Links an array of tokenIDs to a set ID
    /// @param tokenIDs The array of tokenIDs to link
    /// @param set The set id to link the tokens to
    function linkTokensToSet(uint256[] memory tokenIDs, uint256 set) public onlyOwner {
        for (uint i = 0; i < tokenIDs.length; i++) {
            tokenSet[tokenIDs[i]] = set;
        }
    }

    /// @notice Get the metadataURI for a specific token
    /// @param tokenID The array of tokenIDs to link
    function getTokenMetadataURI(uint256 tokenID) public view returns (string memory) {
        uint256 set = tokenSet[tokenID];
        if (set > 0) {
            address rendererAddress = setRenderers[set];

            if (rendererAddress != address(0)) {
                return IOpepenSetMetadataRenderer(rendererAddress).tokenURI(tokenID);
            }
        }

        return defaultMetadataURI;
    }
}
