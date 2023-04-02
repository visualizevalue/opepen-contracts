// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { IERC721Drop } from "./interfaces/IERC721Drop.sol";
import { IMetadataRenderer } from "./interfaces/IMetadataRenderer.sol";
import { IDropConfigGetter } from "./interfaces/IDropConfigGetter.sol";
import { NFTMetadataRenderer } from "./libraries/NFTMetadataRenderer.sol";
import { MetadataRenderAdminCheck } from "./MetadataRenderAdminCheck.sol";
import { TheOpepenArchive } from "./TheOpepenArchive.sol";

contract OpepenMetadataRenderer is IMetadataRenderer, MetadataRenderAdminCheck {
    /// @notice The Opepen Edition address
    address public edition = 0x6339e5E072086621540D0362C4e3Cea0d643E114;
    address public archive = 0x6339e5E072086621540D0362C4e3Cea0d643E114;
    string public description = "O";

    /// @notice Event for updated Media URIs
    event MediaURIsUpdated(
        address indexed target,
        address sender,
        string imageURI,
        string animationURI
    );

    /// @dev admin function indexer feedback
    event EditionInitialized(
        address indexed target,
        string description,
        string imageURI,
        string animationURI
    );

    /// @notice Description updated for this edition
    /// @dev admin function indexer feedback
    event DescriptionUpdated(
        address indexed target,
        address sender,
        string newDescription
    );

    /// @notice Admin function to update description
    /// @param newDescription new description
    function updateDescription(string memory newDescription)
        external
        requireSenderAdmin(edition)
    {
        description = newDescription;

        emit DescriptionUpdated({
            target: edition,
            sender: msg.sender,
            newDescription: newDescription
        });
    }

    /// @notice Contract URI information getter
    /// @return contract uri (if set)
    function contractURI() external view override returns (string memory) {
        IERC721Drop.Configuration memory config = IDropConfigGetter(edition).config();

        return
            NFTMetadataRenderer.encodeContractURIJSON({
                name: "Opepen Edition",
                description: "O",
                imageURI: "",
                animationURI: "",
                royaltyBPS: uint256(config.royaltyBPS),
                royaltyRecipient: config.fundsRecipient
            });
    }

    /// @notice Token URI information getter
    /// @param tokenId to get uri for
    /// @return contract uri (if set)
    function tokenURI(uint256 tokenId)
        external
        view
        override
        returns (string memory)
    {
        TheOpepenArchive _archive = TheOpepenArchive(archive);

        uint256 customKey = _archive.tokenSubEditionKeys(tokenId);
        if (customKey > 0) {
            return _archive.subEditionMetadataURIs(customKey);
        }

        return _archive.defaultMetadataURI();
    }

    /// @dev We don't need to do anything in here, as we don't hold this data onchain.
    /// @param data data to init with
    function initializeWithData(bytes memory data) external {
        // ...
    }
}
