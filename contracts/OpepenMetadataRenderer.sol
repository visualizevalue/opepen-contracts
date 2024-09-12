// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC721Drop } from "./interfaces/IERC721Drop.sol";
import { IMetadataRenderer } from "./interfaces/IMetadataRenderer.sol";
import { NFTMetadataRenderer } from "./libraries/NFTMetadataRenderer.sol";
import { MetadataRenderAdminCheck } from "./MetadataRenderAdminCheck.sol";
import { TheOpepenArchive } from "./TheOpepenArchive.sol";

contract OpepenMetadataRenderer is IMetadataRenderer, MetadataRenderAdminCheck {
    /// @notice The Opepen Edition address
    address public edition = 0x6339e5E072086621540D0362C4e3Cea0d643E114;

    /// @notice The Opepen Archive address
    address public archive;

    /// @notice The collection description
    string public description = "O";

    /// @notice Description updated for this edition
    /// @dev admin function indexer feedback
    event DescriptionUpdated(
        address indexed target,
        address sender,
        string newDescription
    );

    constructor (address archive_) {
        archive = archive_;
    }

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
        return
            NFTMetadataRenderer.encodeContractURIJSON({
                name: "Opepen",
                description: description,
                imageURI: "",
                animationURI: "",
                royaltyBPS: 0,
                royaltyRecipient: address(0)
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
        return TheOpepenArchive(archive).getTokenMetadataURI(tokenId);
    }

    /// @dev We don't need to do anything in here, as we don't hold this data onchain.
    /// @param data data to init with
    function initializeWithData(bytes memory data) external {
        // ...
    }
}
